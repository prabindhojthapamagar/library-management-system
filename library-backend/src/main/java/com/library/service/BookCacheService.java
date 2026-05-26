package com.library.service;

import com.library.dto.BookResponse;
import com.library.utils.BookMapper;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/** Simple per-id cache of {@link BookResponse} for fast reads after first load. */
@Service
public class BookCacheService {

    private final Map<Long, BookResponse> byId = new ConcurrentHashMap<>();

    public Optional<BookResponse> get(Long id) {
        return Optional.ofNullable(byId.get(id));
    }

    public void putFromEntity(com.library.model.Book book) {
        byId.put(book.getId(), BookMapper.toResponse(book));
    }

    public void evict(Long id) {
        byId.remove(id);
    }

    public void clear() {
        byId.clear();
    }
}
