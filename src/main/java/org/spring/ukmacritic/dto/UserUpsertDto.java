package org.spring.ukmacritic.dto;

import lombok.Builder;

@Builder
public record UserUpsertDto(
        String password,
        String login,
        String name
) {


}
