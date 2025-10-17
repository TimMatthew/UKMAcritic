package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.dto.title.TitleUpsertDto;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.services.TitleService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TitleControllerMockTests {
    @Mock
    private TitleService titleService;

    @InjectMocks
    private TitleController titleController;

    User testUser = new User();

    String titleName = "titleName";
    String overview = "overview";
    List<String> keywords = Arrays.asList("keyword1", "keyword2");
    List<String> genres = Arrays.asList("genre1", "genre2");
    List<String> actors = Arrays.asList("actor1", "actor2");
    List<String> director =  Arrays.asList("director1", "director2");
    short releaseYear = 2005;
    byte rating = 2;
    String imageUrl = "imageUrl";
    String tmdbId =  "tmdbId";

    private UUID titleId =  UUID.randomUUID();

    private final String jwt = "fake-jwt";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate() {
        TitleUpsertDto dto = new TitleUpsertDto(titleName, overview,  keywords, genres,
                actors, director, releaseYear, rating, imageUrl);
        when(titleService.create(dto, jwt)).thenReturn(titleId);

        UUID result = titleController.create(dto, jwt);

        assertEquals(titleId, result);
        verify(titleService).create(dto, jwt);
    }

    @Test
    void testGet() {
        TitleResponseDto response = new TitleResponseDto(UUID.randomUUID(), tmdbId, titleName, overview, keywords,
                genres, actors, director, releaseYear, rating, imageUrl);
        when(titleService.get(titleId)).thenReturn(response);

        TitleResponseDto result = titleController.get(titleId);
        assertEquals(response, result);
        verify(titleService).get(titleId);
    }

    @Test
    void testGetAll() {
        List<TitleResponseDto> response = new ArrayList<TitleResponseDto>();
        response.add(new TitleResponseDto(UUID.randomUUID(), tmdbId, titleName, overview, keywords,
                genres, actors, director, releaseYear, rating, imageUrl));
        response.add(new TitleResponseDto(UUID.randomUUID(), "dbhdd", "diffname", "overview", keywords,
                genres, actors, director, (short) 2004, rating, "dnhdjdj"));

        when(titleService.getAll()).thenReturn(response);

        List<TitleResponseDto> result = titleController.getAll();
        assertEquals(response, result);
        assertEquals(2, result.size());
        verify(titleService).getAll();
    }

    @Test
    void testUpdate() {
        TitleUpsertDto dto = new TitleUpsertDto(titleName, overview,  keywords, genres,
                actors, director, releaseYear, rating, imageUrl);
        TitleUpsertDto updated = new TitleUpsertDto("new_name", "dbhdd", keywords, genres, actors, director, (byte) 2004,
                rating, "dnhdjdj");
        when(titleService.update(titleId, dto, jwt)).thenReturn(updated);

        TitleUpsertDto  result = titleController.update(titleId, dto, jwt);

        assertEquals(updated, result);
        verify(titleService).update(titleId, dto, jwt);
    }

    @Test
    void testDelete() {
        when(titleService.delete(titleId, jwt)).thenReturn(true);

        boolean result = titleController.delete(titleId, jwt);

        assertTrue(result);
        verify(titleService).delete(titleId, jwt);
    }
}
