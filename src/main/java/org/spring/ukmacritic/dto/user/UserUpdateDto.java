package org.spring.ukmacritic.dto.user;

import lombok.Builder;

@Builder
public record UserUpdateDto(
        String login,
        String password,
        String name
) {


}
