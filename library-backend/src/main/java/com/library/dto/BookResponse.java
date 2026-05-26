package com.library.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class BookResponse {

    Long id;
    String title;
    String author;
    String genre;
    String isbn;
    int quantity;
    int availableQuantity;
    Integer publishedYear;
    String description;
    String coverImageUrl;
}
