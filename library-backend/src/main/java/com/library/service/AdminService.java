package com.library.service;

import com.library.dto.AnalyticsResponse;
import com.library.dto.UserSummaryResponse;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toUserSummary).toList();
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse analytics() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long activeLoans = borrowRecordRepository.countByReturnedAtIsNull();
        long overdueLoans = borrowRecordRepository.countByReturnedAtIsNullAndDueDateBefore(Instant.now());
        long totalCopies = bookRepository.findAll().stream().mapToLong(b -> b.getQuantity()).sum();
        long availableCopies = bookRepository.findAll().stream().mapToLong(b -> b.getAvailableQuantity()).sum();
        return AnalyticsResponse.builder()
                .totalBooks(totalBooks)
                .totalUsers(totalUsers)
                .activeLoans(activeLoans)
                .overdueLoans(overdueLoans)
                .totalCopies(totalCopies)
                .availableCopies(availableCopies)
                .build();
    }

    private UserSummaryResponse toUserSummary(User user) {
        long active = borrowRecordRepository.countByUserAndReturnedAtIsNull(user);
        return UserSummaryResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .activeBorrows(active)
                .build();
    }
}
