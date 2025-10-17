package org.spring.ukmacritic.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.favourites.FavCreateDto;
import org.spring.ukmacritic.dto.favourites.FavResponseDto;
import org.spring.ukmacritic.entities.FavouriteTitle;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.FavouriteRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.JWTUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class FavouritesServiceMockTests {
    @Mock
    private FavouriteRepo favouriteRepo;

    @Mock
    private TitleRepo titleRepo;

    @Mock
    private UserRepo userRepo;

    @Mock
    private JWTUtils jwt;

    @InjectMocks
    private FavouriteService favService;

    private String jwtToken;
    private UUID favId;
    private UUID userId;
    private UUID titleId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtToken = "fake-jwt";
        favId = UUID.randomUUID();
        userId = UUID.randomUUID();
        titleId = UUID.randomUUID();
    }

    @Test
    void testCreateSuccess() {
        FavCreateDto dto = new FavCreateDto(titleId, userId);

        when(jwt.extractRole(jwtToken)).thenReturn("false");

        User user = new User();
        user.setUserId(userId);

        Title title = new Title();
        title.setTitleId(titleId);

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));

        FavouriteTitle fav = FavouriteTitle.builder()
                .favId(favId)
                .user(user)
                .title(title)
                .build();

        when(favouriteRepo.saveAndFlush(any(FavouriteTitle.class))).thenReturn(fav);

        UUID result = favService.create(dto, jwtToken);

        assertEquals(favId, result);
        verify(favouriteRepo).saveAndFlush(any(FavouriteTitle.class));
        verify(jwt).extractRole(jwtToken);
        verify(userRepo).findById(userId);
        verify(titleRepo).findById(titleId);
    }

    @Test
    void testGetAll() {
        User user = new User(); user.setUserId(userId);
        Title title = new Title(); title.setTitleId(titleId);

        FavouriteTitle fav = FavouriteTitle.builder()
                .favId(favId)
                .user(user)
                .title(title)
                .build();

        when(favouriteRepo.findAll()).thenReturn(List.of(fav));

        List<FavResponseDto> result = favService.getAll();

        assertEquals(1, result.size());
        assertEquals(favId, result.get(0).favId());
        verify(favouriteRepo).findAll();
    }

    @Test
    void testDeleteSuccess() {
        when(favouriteRepo.existsById(favId)).thenReturn(true);

        boolean result = favService.delete(favId, jwtToken);

        assertTrue(result);
        verify(favouriteRepo).existsById(favId);
        verify(favouriteRepo).deleteById(favId);
    }

    @Test
    void testCreateAccessDenied() {
        FavCreateDto dto = new FavCreateDto(userId, titleId);

        when(jwt.extractRole(jwtToken)).thenReturn("true");

        SecurityException ex = assertThrows(SecurityException.class, () -> favService.create(dto, jwtToken));
        assertEquals("Access denied: only client are allowed to perform this action!", ex.getMessage());
    }

    @Test
    void testCreateTitleNotFound() {
        FavCreateDto dto = new FavCreateDto(titleId, userId);

        when(jwt.extractRole(jwtToken)).thenReturn("false");
        when(titleRepo.findById(titleId)).thenReturn(Optional.empty());

        SecurityException ex = assertThrows(SecurityException.class, () -> favService.create(dto, jwtToken));
        assertEquals("Title with "+titleId+" id is not found!", ex.getMessage());
    }
}
