package com.library.dto;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BorrowRecordResponse {

    Long id;
    Long bookId;
    String bookTitle;
    String bookAuthor;
    Instant borrowedAt;
    Instant dueDate;
    Instant returnedAt;
    boolean overdue;
    BigDecimal fineAmount;
}
