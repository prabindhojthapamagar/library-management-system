package com.library.service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;


@Service
public class ActiveBorrowRegistry {

    private final Map<String, Long> keyToBorrowId = new ConcurrentHashMap<>();

    private static String key(long userId, long bookId) {
        return userId + ":" + bookId;
    }

    public void register(long userId, long bookId, long borrowRecordId) {
        keyToBorrowId.put(key(userId, bookId), borrowRecordId);
    }

    public void unregister(long userId, long bookId) {
        keyToBorrowId.remove(key(userId, bookId));
    }

    public Optional<Long> findBorrowRecordId(long userId, long bookId) {
        return Optional.ofNullable(keyToBorrowId.get(key(userId, bookId)));
    }
}
