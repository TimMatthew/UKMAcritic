package org.spring.ukmacritic.dto;

import lombok.Builder;
import org.spring.ukmacritic.entities.User;

import java.util.UUID;

@Builder
public record UserTestDto(

        UUID id,
        String email,
        String password,
        String login,
        String name,
        boolean state
) {


}
