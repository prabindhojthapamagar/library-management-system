package com.library.repository;

import com.library.model.BorrowRecord;
import com.library.model.User;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    long countByBook_Id(Long bookId);

    @Query(
            """
            SELECT br FROM BorrowRecord br
            JOIN FETCH br.book
            WHERE br.user = :user AND br.returnedAt IS NULL
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecord> findActiveByUser(@Param("user") User user);

    @Query(
            """
            SELECT br FROM BorrowRecord br
            JOIN FETCH br.book
            WHERE br.user = :user
            ORDER BY br.borrowedAt DESC
            """)
    List<BorrowRecord> findAllByUser(@Param("user") User user);

    @Query(
            """
            SELECT br FROM BorrowRecord br
            JOIN FETCH br.user u
            JOIN FETCH br.book b
            WHERE br.returnedAt IS NULL
            ORDER BY br.dueDate ASC
            """)
    List<BorrowRecord> findAllActiveWithUserAndBook();

    @Query(
            """
            SELECT br FROM BorrowRecord br
            JOIN FETCH br.user u
            JOIN FETCH br.book b
            ORDER BY br.borrowedAt DESC
            """)
    List<BorrowRecord> findAllWithUserAndBook();

    long countByReturnedAtIsNull();

    long countByReturnedAtIsNullAndDueDateBefore(Instant instant);

    long countByUserAndReturnedAtIsNull(User user);

    Optional<BorrowRecord> findByIdAndUser(Long id, User user);

    @Query(
            """
            SELECT br FROM BorrowRecord br
            WHERE br.user = :user AND br.book.id = :bookId AND br.returnedAt IS NULL
            """)
    Optional<BorrowRecord> findActiveByUserAndBookId(@Param("user") User user, @Param("bookId") Long bookId);
}
