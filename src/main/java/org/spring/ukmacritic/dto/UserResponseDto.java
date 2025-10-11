package org.spring.ukmacritic.dto;


import lombok.Builder;

import java.util.UUID;

@Builder
public record UserResponseDto(

    UUID userId,
    String userName,
    String login,
    boolean state

) {

}
