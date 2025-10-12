package org.spring.ukmacritic.dto.comment;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
public record CommentUpdateDto(
        byte rating,
        String info
) {
}
