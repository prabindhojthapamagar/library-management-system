package com.library.controller;

import com.library.dto.AnalyticsResponse;
import com.library.dto.BookResponse;
import com.library.dto.BorrowRecordAdminResponse;
import com.library.dto.UserSummaryResponse;
import com.library.service.AdminService;
import com.library.service.BookService;
import com.library.service.BorrowService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final BorrowService borrowService;
    private final BookService bookService;

    @GetMapping("/users")
    public List<UserSummaryResponse> users() {
        return adminService.listUsers();
    }

    @GetMapping("/borrow-records")
    public List<BorrowRecordAdminResponse> borrowHistory() {
        return borrowService.fullHistoryAdmin();
    }

    @GetMapping("/borrow-records/active")
    public List<BorrowRecordAdminResponse> activeLoans() {
        return borrowService.allActiveLoansAdmin();
    }

    @GetMapping("/analytics")
    public AnalyticsResponse analytics() {
        return adminService.analytics();
    }

    @GetMapping("/books/inventory")
    public List<BookResponse> inventorySorted(@RequestParam(required = false) String sortBy) {
        return bookService.listAllSortedForAdmin(sortBy);
    }
}
