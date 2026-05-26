package com.library.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AnalyticsResponse {

    long totalBooks;
    long totalUsers;
    long activeLoans;
    long overdueLoans;
    long totalCopies;
    long availableCopies;
}
