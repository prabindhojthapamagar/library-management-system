package com.library.utils;

import com.library.dto.BookResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Demonstrates Comparator-based sorting with {@link Collections#sort} for in-memory book lists (analytics,
 * exports, or cached slices). Paginated API sorting is usually done in the database via {@code Pageable}.
 */
public final class BookSorter {

    private BookSorter() {}

    public static void sortByTitle(List<BookResponse> books) {
        Collections.sort(books, Comparator.comparing(BookResponse::getTitle, String.CASE_INSENSITIVE_ORDER));
    }

    public static void sortByAuthor(List<BookResponse> books) {
        books.sort(Comparator.comparing(BookResponse::getAuthor, String.CASE_INSENSITIVE_ORDER));
    }

    public static void sortByAvailability(List<BookResponse> books) {
        books.sort(Comparator.comparingInt(BookResponse::getAvailableQuantity).reversed());
    }

    public static void sortByPublishedYear(List<BookResponse> books) {
        books.sort(Comparator.comparing(
                BookResponse::getPublishedYear, Comparator.nullsLast(Comparator.naturalOrder())));
    }

    /** Sort borrow-related projections by due date on the DTO layer when needed. */
    public static <T> List<T> sortByDueDate(List<T> items, Comparator<T> dueDateComparator) {
        List<T> sorted = new ArrayList<>(items);
        Collections.sort(sorted, dueDateComparator);
        return sorted;
    }
}
