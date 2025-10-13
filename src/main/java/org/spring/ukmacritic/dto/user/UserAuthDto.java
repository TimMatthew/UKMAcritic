package org.spring.ukmacritic.dto.user;

import lombok.Builder;

@Builder
public record UserAuthDto(
        String login,
        String password
) {

}
