package org.spring.ukmacritic.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.dto.title.TitleUpsertDto;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.security.JWTUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class TitlesServiceMockTests {
    @Mock
    private TitleRepo titleRepo;

    @Mock
    private JWTUtils jwt;

    @InjectMocks
    private TitleService titleService;

    private String jwtToken;
    private UUID titleId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtToken = "fake-jwt";
        titleId = UUID.randomUUID();
    }

    @Test
    void testCreateSuccess() {
        TitleUpsertDto dto = new TitleUpsertDto("Film", "Overview", List.of("keyword"), List.of("genre"),
                List.of("actor"), List.of("Director"), (short) 2025, (byte) 5, "image.jpg");

        when(jwt.extractRole(jwtToken)).thenReturn("true");

        Title titleEntity = Title.builder()
                .titleId(titleId)
                .tmdbId("tmdb123")
                .titleName(dto.titleName())
                .overview(dto.overview())
                .build();

        when(titleRepo.saveAndFlush(any(Title.class))).thenReturn(titleEntity);

        UUID result = titleService.create(dto, jwtToken);

        assertEquals(titleId, result);
        verify(titleRepo).saveAndFlush(any(Title.class));
        verify(jwt).extractRole(jwtToken);
    }

    @Test
    void testGetSuccess() {
        Title title = new Title();
        title.setTitleId(titleId);
        title.setTitleName("Film");

        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));

        TitleResponseDto result = titleService.get(titleId);

        assertEquals(titleId, result.id());
        verify(titleRepo).findById(titleId);
    }

    @Test
    void testGetAllSuccess() {
        Title title1 = new Title(); title1.setTitleId(UUID.randomUUID()); title1.setTitleName("Film1");
        Title title2 = new Title(); title2.setTitleId(UUID.randomUUID()); title2.setTitleName("Film2");

        when(titleRepo.findAll()).thenReturn(List.of(title1, title2));

        List<TitleResponseDto> result = titleService.getAll();

        assertEquals(2, result.size());
        verify(titleRepo).findAll();
    }

    @Test
    void testUpdateSuccess() {
        TitleUpsertDto dto = new TitleUpsertDto("NewFilm", "NewOverview", List.of(), List.of(),
                List.of(), List.of("NewDirector"), (short)2025, (byte) 5, "image.jpg");

        when(jwt.extractRole(jwtToken)).thenReturn("true");

        Title title = new Title();
        title.setTitleId(titleId);
        title.setTitleName("OldFilm");

        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));
        when(titleRepo.saveAndFlush(any(Title.class))).thenReturn(title);

        TitleUpsertDto result = titleService.update(titleId, dto, jwtToken);

        assertEquals("NewFilm", result.titleName());
        verify(titleRepo).saveAndFlush(title);
        verify(jwt).extractRole(jwtToken);
    }

    @Test
    void testDeleteSuccess() {
        Title title = new Title();
        title.setTitleId(titleId);

        when(jwt.extractRole(jwtToken)).thenReturn("true");
        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));

        boolean result = titleService.delete(titleId, jwtToken);

        assertTrue(result);
        verify(titleRepo).delete(title);
        verify(jwt).extractRole(jwtToken);
    }
}
