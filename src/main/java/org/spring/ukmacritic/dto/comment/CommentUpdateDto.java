package org.spring.ukmacritic.dto.comment;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.entities.User;

@Builder
public record CommentUpdateDto(
        User userId,
        byte rating,
        String info
) {
}
