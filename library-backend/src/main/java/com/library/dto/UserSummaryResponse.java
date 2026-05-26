package com.library.dto;

import com.library.model.Role;
import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserSummaryResponse {

    Long id;
    String username;
    String email;
    Role role;
    Instant createdAt;
    long activeBorrows;
}
