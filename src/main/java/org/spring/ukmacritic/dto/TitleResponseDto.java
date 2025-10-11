package org.spring.ukmacritic.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record TitleResponseDto(
        List<String> directors,
        List<String> genres,
        List<String> actors,
        List<String> regions,
        String titleName,
        String overview,
        short releaseYear,
        int tmdb
) {

}
