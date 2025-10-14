package org.spring.ukmacritic.dto.user;

import lombok.Builder;

@Builder
public record UserRegisterDto(

        String email,
        String password,
        String login,
        String name,
        boolean state
) {


}
