package org.spring.ukmacritic.dto.user;

import lombok.Builder;

@Builder
public record UerAuthResponseDto(
        String token,
        UserResponseDto user
) {

}
