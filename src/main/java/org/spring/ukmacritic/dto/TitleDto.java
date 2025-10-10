package org.spring.ukmacritic.dto;

import java.time.OffsetDateTime;
import java.util.ArrayList;

public record TitleDto(
    String titleName,
    short releaseYear,
    byte rating,
    ArrayList<String> genres,
    ArrayList<String> directors,
    ArrayList<String> actors,
    ArrayList<String> region,
    String overview

) {
}
