package com.library.dto;

import com.library.model.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {

    String token;
    String tokenType;
    Long userId;
    String username;
    String email;
    Role role;
}
