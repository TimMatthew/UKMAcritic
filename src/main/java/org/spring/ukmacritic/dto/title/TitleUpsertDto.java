package org.spring.ukmacritic.dto.title;

import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
public record TitleUpsertDto(
        List<String> directors,
        List<String> genres,
        List<String> actors,
        List<String> regions,
        String titleName,
        String overview,
        short releaseYear,
        byte rating,
        int tmdb
) {

}