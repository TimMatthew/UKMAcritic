package org.spring.ukmacritic.dto.favourites;

import org.spring.ukmacritic.entities.Title;

import java.util.UUID;

public record FavResponseDto(
        UUID favId,
        Title titleId,
        UUID userId
) {

}
