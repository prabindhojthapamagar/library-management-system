package com.library.controller;

import com.library.dto.BorrowRecordResponse;
import com.library.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/return")
@RequiredArgsConstructor
public class ReturnController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    public BorrowRecordResponse returnBook(Authentication authentication, @PathVariable Long bookId) {
        return borrowService.returnBook(authentication, bookId);
    }
}
