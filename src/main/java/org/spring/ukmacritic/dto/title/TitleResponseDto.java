package org.spring.ukmacritic.dto.title;

import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record TitleResponseDto(
        UUID id,
        String titleName,
        String overview,
        List<String> keywords,
        List<String> genres,
        List<String> actors,
        List<String> director,
        short releaseYear,
        byte rating,
        String imageUrl
) {

}
