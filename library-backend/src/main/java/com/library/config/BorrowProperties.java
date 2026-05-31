package com.library.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.borrow")
public class BorrowProperties {

    /** Loan length in days when a book is borrowed. */
    private int defaultDays = 14;
}
