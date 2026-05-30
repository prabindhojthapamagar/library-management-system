package com.library.utils;

import com.library.dto.BookResponse;
import com.library.model.Book;

public final class BookMapper {

    private BookMapper() {}

    public static BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .genre(book.getGenre())
                .isbn(book.getIsbn())
                .quantity(book.getQuantity())
                .availableQuantity(book.getAvailableQuantity())
                .publishedYear(book.getPublishedYear())
                .description(book.getDescription())
                .coverImageUrl(book.getCoverImageUrl())
                .build();
    }
}
