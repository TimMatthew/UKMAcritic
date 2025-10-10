package org.spring.ukmacritic.dto;

import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;

import java.time.OffsetDateTime;

public record CommentDto(
        User user,
        Title title,
        OffsetDateTime creationDate,
        byte rating,
        String info
) {



}
