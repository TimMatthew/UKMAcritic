package org.spring.ukmacritic.dto.user;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserProfileDto(
        UUID userId,
        String userName,
        String email,
        String login,
        boolean state
) {
}
