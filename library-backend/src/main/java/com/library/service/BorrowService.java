package com.library.service;

import com.library.config.BorrowProperties;
import com.library.dto.BorrowRecordAdminResponse;
import com.library.dto.BorrowRecordResponse;
import com.library.exception.ApiException;
import com.library.model.Book;
import com.library.model.BorrowRecord;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import com.library.security.LibraryUserPrincipal;
import com.library.utils.BookSorter;
import com.library.utils.BorrowMapper;
import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private static final BigDecimal FINE_PER_DAY = new BigDecimal("0.50");

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowProperties borrowProperties;
    private final ActiveBorrowRegistry activeBorrowRegistry;
    private final BookCacheService bookCacheService;

    @PostConstruct
    public void warmActiveBorrowRegistry() {
        borrowRecordRepository.findAllActiveWithUserAndBook().forEach(br -> activeBorrowRegistry.register(
                br.getUser().getId(), br.getBook().getId(), br.getId()));
    }

    @Transactional
    public BorrowRecordResponse borrow(Authentication authentication, Long bookId) {
        User user = resolveUser(authentication);
        Book book = bookRepository
                .findById(bookId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));
        if (book.getAvailableQuantity() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Book is out of stock");
        }
        if (borrowRecordRepository.findActiveByUserAndBookId(user, bookId).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "You already have an active loan for this book");
        }
        Instant now = Instant.now();
        Instant due = now.plus(borrowProperties.getDefaultDays(), ChronoUnit.DAYS);
        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowedAt(now)
                .dueDate(due)
                .fineAmount(BigDecimal.ZERO)
                .build();
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);
        BorrowRecord saved = borrowRecordRepository.save(record);
        activeBorrowRegistry.register(user.getId(), book.getId(), saved.getId());
        bookCacheService.putFromEntity(book);
        return BorrowMapper.toResponse(saved);
    }

    @Transactional
    public BorrowRecordResponse returnBook(Authentication authentication, Long bookId) {
        User user = resolveUser(authentication);
        BorrowRecord br = borrowRecordRepository
                .findActiveByUserAndBookId(user, bookId)
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "No active loan found for this book"));
        Instant now = Instant.now();
        br.setReturnedAt(now);
        BigDecimal fine = calculateFine(br.getDueDate(), now);
        br.setFineAmount(fine);
        Book book = br.getBook();
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);
        bookRepository.save(book);
        borrowRecordRepository.save(br);
        activeBorrowRegistry.unregister(user.getId(), book.getId());
        bookCacheService.putFromEntity(book);
        return BorrowMapper.toResponse(br);
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordResponse> myActiveBorrows(Authentication authentication) {
        User user = resolveUser(authentication);
        List<BorrowRecordResponse> list = borrowRecordRepository.findActiveByUser(user).stream()
                .map(BorrowMapper::toResponse)
                .collect(Collectors.toCollection(ArrayList::new));
        return BookSorter.sortByDueDate(list, BorrowMapper.dueDateComparator());
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordResponse> myHistory(Authentication authentication) {
        User user = resolveUser(authentication);
        return borrowRecordRepository.findAllByUser(user).stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordAdminResponse> allActiveLoansAdmin() {
        return borrowRecordRepository.findAllActiveWithUserAndBook().stream()
                .map(BorrowMapper::toAdmin)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BorrowRecordAdminResponse> fullHistoryAdmin() {
        return borrowRecordRepository.findAllWithUserAndBook().stream()
                .map(BorrowMapper::toAdmin)
                .toList();
    }

    private static BigDecimal calculateFine(Instant dueDate, Instant returnTime) {
        if (!returnTime.isAfter(dueDate)) {
            return BigDecimal.ZERO;
        }
        long days = ChronoUnit.DAYS.between(
                dueDate.atZone(ZoneOffset.UTC).toLocalDate(),
                returnTime.atZone(ZoneOffset.UTC).toLocalDate());
        long billableDays = Math.max(1, days);
        return FINE_PER_DAY.multiply(BigDecimal.valueOf(billableDays));
    }

    private User resolveUser(Authentication authentication) {
        LibraryUserPrincipal principal = (LibraryUserPrincipal) authentication.getPrincipal();
        return userRepository
                .findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
