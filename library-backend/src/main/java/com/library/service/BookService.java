package com.library.service;

import com.library.dto.BookRequest;
import com.library.dto.BookResponse;
import com.library.dto.PageResponse;
import com.library.exception.ApiException;
import com.library.model.Book;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.utils.BookMapper;
import com.library.utils.BookSorter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final BookCacheService bookCacheService;

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> listBooks(String query, int page, int size, String sortBy, String direction) {
        Sort sort = resolveSort(sortBy, direction);
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100), sort);
        Page<Book> bookPage;
        if (query == null || query.isBlank()) {
            bookPage = bookRepository.findAll(pageable);
        } else {
            bookPage = bookRepository.search(query.trim(), pageable);
        }
        return toPageResponse(bookPage);
    }

    /**
     * Example of Stream API sorting (in-memory) for a full catalog snapshot — useful for exports or admin
     * previews; paginated reads should prefer database {@link Sort}.
     */
    @Transactional(readOnly = true)
    public List<BookResponse> catalogSortedByTitleStream() {
        return bookRepository.findAll().stream()
                .map(BookMapper::toResponse)
                .sorted(Comparator.comparing(BookResponse::getTitle, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    /** Applies {@link BookSorter} + {@link Collections#sort} for admin-side reordering demos. */
    @Transactional(readOnly = true)
    public List<BookResponse> listAllSortedForAdmin(String sortBy) {
        List<BookResponse> list = new ArrayList<>(
                bookRepository.findAll().stream().map(BookMapper::toResponse).toList());
        if (sortBy == null) {
            BookSorter.sortByTitle(list);
            return list;
        }
        switch (sortBy.toLowerCase()) {
            case "author" -> BookSorter.sortByAuthor(list);
            case "availability" -> BookSorter.sortByAvailability(list);
            case "year", "publishedyear" -> BookSorter.sortByPublishedYear(list);
            default -> BookSorter.sortByTitle(list);
        }
        return list;
    }

    @Transactional(readOnly = true)
    public BookResponse getById(Long id) {
        return bookCacheService
                .get(id)
                .orElseGet(() -> {
                    Book book = bookRepository
                            .findById(id)
                            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));
                    bookCacheService.putFromEntity(book);
                    return BookMapper.toResponse(book);
                });
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        String isbn = request.getIsbn().trim();
        if (bookRepository.findByIsbn(isbn).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "A book with this ISBN already exists");
        }
        int qty = request.getQuantity();
        if (qty < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity cannot be negative");
        }
        Book book = Book.builder()
                .title(request.getTitle().trim())
                .author(request.getAuthor().trim())
                .genre(request.getGenre().trim())
                .isbn(isbn)
                .quantity(qty)
                .availableQuantity(qty)
                .publishedYear(request.getPublishedYear())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .build();
        Book saved = bookRepository.save(book);
        bookCacheService.putFromEntity(saved);
        return BookMapper.toResponse(saved);
    }

    @Transactional
    public BookResponse update(Long id, BookRequest request) {
        Book book = bookRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));
        String newIsbn = request.getIsbn().trim();
        if (!newIsbn.equals(book.getIsbn()) && bookRepository.findByIsbn(newIsbn).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "A book with this ISBN already exists");
        }
        int onLoan = book.getQuantity() - book.getAvailableQuantity();
        int newQty = request.getQuantity();
        if (newQty < onLoan) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "New quantity cannot be less than copies currently borrowed (" + onLoan + ")");
        }
        book.setTitle(request.getTitle().trim());
        book.setAuthor(request.getAuthor().trim());
        book.setGenre(request.getGenre().trim());
        book.setIsbn(newIsbn);
        book.setQuantity(newQty);
        book.setAvailableQuantity(newQty - onLoan);
        book.setPublishedYear(request.getPublishedYear());
        book.setDescription(request.getDescription());
        book.setCoverImageUrl(request.getCoverImageUrl());
        Book saved = bookRepository.save(book);
        bookCacheService.putFromEntity(saved);
        return BookMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Book book = bookRepository
                .findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found"));
        int onLoan = book.getQuantity() - book.getAvailableQuantity();
        if (onLoan > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "Cannot delete a book that still has active loans");
        }
        if (borrowRecordRepository.countByBook_Id(id) > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "Cannot delete a book with borrowing history");
        }
        bookRepository.delete(book);
        bookCacheService.evict(id);
    }

    private static PageResponse<BookResponse> toPageResponse(Page<Book> page) {
        List<BookResponse> content = page.getContent().stream().map(BookMapper::toResponse).toList();
        return PageResponse.<BookResponse>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private static Sort resolveSort(String sortBy, String direction) {
        Sort.Direction dir =
                "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String field = "title";
        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "author" -> field = "author";
                case "availability", "availablequantity" -> field = "availableQuantity";
                case "year", "publishedyear" -> field = "publishedYear";
                case "title" -> field = "title";
                default -> field = "title";
            }
        }
        return Sort.by(dir, field);
    }
}
