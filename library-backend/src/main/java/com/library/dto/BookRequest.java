package com.library.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    @Size(max = 255)
    private String author;

    @NotBlank
    @Size(max = 100)
    private String genre;

    @NotBlank
    @Size(max = 32)
    private String isbn;

    @NotNull
    @Min(0)
    private Integer quantity;

    private Integer publishedYear;

    @Size(max = 4000)
    private String description;

    @Size(max = 1024)
    private String coverImageUrl;
}
