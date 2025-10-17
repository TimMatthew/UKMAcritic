package org.spring.ukmacritic.dto.favourites;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.entities.Title;

import java.util.UUID;

@Builder
public record FavCreateDto(
        UUID titleId,
        UUID userId
) {

}
