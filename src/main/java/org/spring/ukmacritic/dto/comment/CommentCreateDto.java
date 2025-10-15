package org.spring.ukmacritic.dto.comment;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record CommentCreateDto(
        String userId,
        String titleId,
        byte rating,
        String info
) {
}
