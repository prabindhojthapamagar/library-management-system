package com.library.utils;

import com.library.dto.BorrowRecordAdminResponse;
import com.library.dto.BorrowRecordResponse;
import com.library.model.BorrowRecord;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;

public final class BorrowMapper {

    private BorrowMapper() {}

    public static BorrowRecordResponse toResponse(BorrowRecord br) {
        Instant now = Instant.now();
        boolean overdue = br.getReturnedAt() == null && now.isAfter(br.getDueDate());
        return BorrowRecordResponse.builder()
                .id(br.getId())
                .bookId(br.getBook().getId())
                .bookTitle(br.getBook().getTitle())
                .bookAuthor(br.getBook().getAuthor())
                .borrowedAt(br.getBorrowedAt())
                .dueDate(br.getDueDate())
                .returnedAt(br.getReturnedAt())
                .overdue(overdue)
                .fineAmount(br.getFineAmount() != null ? br.getFineAmount() : BigDecimal.ZERO)
                .build();
    }

    public static BorrowRecordAdminResponse toAdmin(BorrowRecord br) {
        Instant now = Instant.now();
        boolean overdue = br.getReturnedAt() == null && now.isAfter(br.getDueDate());
        return BorrowRecordAdminResponse.builder()
                .id(br.getId())
                .borrowerId(br.getUser().getId())
                .borrowerUsername(br.getUser().getUsername())
                .borrowerEmail(br.getUser().getEmail())
                .bookId(br.getBook().getId())
                .bookTitle(br.getBook().getTitle())
                .bookAuthor(br.getBook().getAuthor())
                .borrowedAt(br.getBorrowedAt())
                .dueDate(br.getDueDate())
                .returnedAt(br.getReturnedAt())
                .overdue(overdue)
                .fineAmount(br.getFineAmount() != null ? br.getFineAmount() : BigDecimal.ZERO)
                .build();
    }

    public static Comparator<BorrowRecordResponse> dueDateComparator() {
        return Comparator.comparing(BorrowRecordResponse::getDueDate);
    }
}
