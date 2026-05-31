package com.library.config;

import com.library.model.Book;
import com.library.model.Role;
import com.library.model.User;
import com.library.repository.BookRepository;
import com.library.repository.UserRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedLibraryData() {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@library.local")
                        .password(passwordEncoder.encode("Admin123!"))
                        .role(Role.ADMIN)
                        .createdAt(Instant.now())
                        .build();
                userRepository.save(admin);
            }
            if (userRepository.findByUsername("demo").isEmpty()) {
                User demo = User.builder()
                        .username("demo")
                        .email("demo@library.local")
                        .password(passwordEncoder.encode("DemoUser123!"))
                        .role(Role.USER)
                        .createdAt(Instant.now())
                        .build();
                userRepository.save(demo);
            }
            if (bookRepository.count() == 0) {
                bookRepository.save(sampleBook(
                        "Clean Code",
                        "Robert C. Martin",
                        "Software",
                        "9780132350884",
                        5,
                        2008,
                        "Guidelines for writing readable and maintainable software."));
                bookRepository.save(sampleBook(
                        "Effective Java",
                        "Joshua Bloch",
                        "Software",
                        "9780134685991",
                        4,
                        2017,
                        "Best practices for the Java programming language."));
                bookRepository.save(sampleBook(
                        "The Pragmatic Programmer",
                        "David Thomas, Andrew Hunt",
                        "Software",
                        "9780135957059",
                        3,
                        2019,
                        "Classic advice on software craftsmanship."));
                bookRepository.save(sampleBook(
                        "1984",
                        "George Orwell",
                        "Fiction",
                        "9780451524935",
                        6,
                        1949,
                        "Dystopian social science fiction novel."));
                bookRepository.save(sampleBook(
                        "Sapiens",
                        "Yuval Noah Harari",
                        "History",
                        "9780062316097",
                        2,
                        2011,
                        "A brief history of humankind."));
            }
        };
    }

    private static Book sampleBook(
            String title, String author, String genre, String isbn, int qty, int year, String description) {
        return Book.builder()
                .title(title)
                .author(author)
                .genre(genre)
                .isbn(isbn)
                .quantity(qty)
                .availableQuantity(qty)
                .publishedYear(year)
                .description(description)
                .coverImageUrl("https://picsum.photos/seed/" + isbn + "/300/450")
                .build();
    }
}
