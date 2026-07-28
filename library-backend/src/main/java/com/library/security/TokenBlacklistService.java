package com.library.security;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Simple in-memory token blacklist for logout. Keys are raw JWT strings; values are expiry epoch millis.
 * Suitable for development/single-node demos — use Redis or a token store for multi-instance production.
 */
@Service
public class TokenBlacklistService {

    private final Map<String, Long> tokenExpiry = new ConcurrentHashMap<>();

    public void blacklist(String token, long expiresAtEpochMs) {
        tokenExpiry.put(token, expiresAtEpochMs);
    }

    public boolean isBlacklisted(String token) {
        Long exp = tokenExpiry.get(token);
        if (exp == null) {
            return false;
        }
        if (exp < System.currentTimeMillis()) {
            tokenExpiry.remove(token);
            return false;
        }
        return true;
    }
}
