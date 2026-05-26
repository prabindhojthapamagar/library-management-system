package com.library.service;

import com.library.dto.UserSummaryResponse;
import com.library.exception.ApiException;
import com.library.model.User;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import com.library.security.LibraryUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    @Transactional(readOnly = true)
    public UserSummaryResponse me(Authentication authentication) {
        LibraryUserPrincipal principal = (LibraryUserPrincipal) authentication.getPrincipal();
        User user = userRepository
                .findById(principal.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
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
