package com.library.controller;

import com.library.dto.BorrowRecordResponse;
import com.library.service.BorrowService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    public BorrowRecordResponse borrow(Authentication authentication, @PathVariable Long bookId) {
        return borrowService.borrow(authentication, bookId);
    }

    @GetMapping("/my-books")
    public List<BorrowRecordResponse> myBooks(Authentication authentication) {
        return borrowService.myActiveBorrows(authentication);
    }

    @GetMapping("/history")
    public List<BorrowRecordResponse> history(Authentication authentication) {
        return borrowService.myHistory(authentication);
    }
}
