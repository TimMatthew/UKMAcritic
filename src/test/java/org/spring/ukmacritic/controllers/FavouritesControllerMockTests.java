package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.favourites.FavCreateDto;
import org.spring.ukmacritic.dto.favourites.FavResponseDto;
import org.spring.ukmacritic.services.FavouriteService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class FavouritesControllerMockTests {
    @Mock
    private FavouriteService favouriteService;

    @InjectMocks
    private FavouritesController favouritesController;

    private UUID favId = UUID.randomUUID();
    private UUID titleId = UUID.randomUUID();
    private UUID userId = UUID.randomUUID();
    private String jwt = "fake-token";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreate() {
        FavCreateDto dto = new FavCreateDto(titleId, userId);
        when(favouriteService.create(dto, jwt)).thenReturn(favId);

        UUID result = favouritesController.create(dto, jwt);

        assertEquals(favId, result);    @Test
//    void testGetAll() {
//        List<FavResponseDto> response = new ArrayList<FavResponseDto>();
//        response.add(new FavResponseDto(UUID.randomUUID(), titleId, userId));
//        response.add(new FavResponseDto(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID()));
//
//        when(favouriteService.getAll()).thenReturn(response);
//
//        List<FavResponseDto> result = favouritesController.getAll();
//        assertEquals(response, result);
//        assertEquals(2, result.size());
//        verify(favouriteService).getAll();
//    }
        verify(favouriteService).create(dto, jwt);
    }

//

    @Test
    void testDelete() {
        when(favouriteService.delete(favId, jwt)).thenReturn(true);

        boolean result = favouriteService.delete(favId, jwt);

        assertTrue(result);
        verify(favouriteService).delete(favId, jwt);
    }
}
