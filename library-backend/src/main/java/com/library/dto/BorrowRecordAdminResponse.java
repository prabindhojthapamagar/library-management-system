package com.library.dto;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BorrowRecordAdminResponse {

    Long id;
    Long borrowerId;
    String borrowerUsername;
    String borrowerEmail;
    Long bookId;
    String bookTitle;
    String bookAuthor;
    Instant borrowedAt;
    Instant dueDate;
    Instant returnedAt;
    boolean overdue;
    BigDecimal fineAmount;
}
