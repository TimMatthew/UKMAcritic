package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.services.CommentService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class CommentsControllerMockTests {
    @Mock
    private CommentService commentsService;

    @InjectMocks
    private CommentController commentsController;

    private final String jwt = "fake-jwt";
    private UUID  commentId, userId, titleId;
    private String  userId_str;
    private String  titleId_str;
    private OffsetDateTime creationDate;
    private String info;
    private byte rating;

    User testUser = new User();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        commentId = (UUID.randomUUID());
        userId = (UUID.randomUUID());
        userId_str = userId.toString();
        titleId = (UUID.randomUUID());
        titleId_str = titleId.toString();
        creationDate = OffsetDateTime.now();
        info = "OMG THE BEST FILM I'VE SEEN!";
        rating = 5;
    }

    @Test
    void testCreate() {
        CommentCreateDto dto = new CommentCreateDto(userId_str, titleId_str, rating, info);
        when(commentsService.create(dto, jwt)).thenReturn(commentId);

        UUID result = commentsController.create(dto, jwt);

        assertEquals(commentId, result);
        verify(commentsService).create(dto, jwt);
    }

    @Test
    void testGet() {
        CommentResponseDto response = new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate, rating, info);
        when(commentsService.get(commentId)).thenReturn(response);

        CommentResponseDto result = commentsController.get(commentId);

        assertEquals(response, result);
        verify(commentsService).get(commentId);
    }

    @Test
    void testGetAll() {
        List<CommentResponseDto> list = List.of(
                new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate, rating, info),
                new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate, (byte) 2, "not that good..")
        );
        when(commentsService.getAll()).thenReturn(list);

        List<CommentResponseDto> result = commentsController.getAll();

        assertEquals(2, result.size());
        verify(commentsService).getAll();
    }

    @Test
    void testGetAllByUser() {
        List<CommentResponseDto> list = List.of(new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate, rating, info));
        when(commentsService.getAllByUser(userId)).thenReturn(list);

        List<CommentResponseDto> result = commentsController.getAllByUser(userId);

        assertEquals(list, result);
        verify(commentsService).getAllByUser(userId);
    }

    @Test
    void testGetAllByTitle() {
        List<CommentResponseDto> list = List.of(new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate, rating, info));
        when(commentsService.getAllByTitle(titleId)).thenReturn(list);

        List<CommentResponseDto> result = commentsController.getAllByTitle(titleId);

        assertEquals(list, result);
        verify(commentsService).getAllByTitle(titleId);
    }

    @Test
    void testUpdate() {
        CommentUpdateDto dto = new CommentUpdateDto(testUser, rating, info);
        CommentResponseDto updated = new CommentResponseDto(UUID.randomUUID(), userId, titleId, creationDate,
                (byte) 1, "nioooooo");
        when(commentsService.update(commentId, dto, jwt)).thenReturn(updated);

        CommentResponseDto result = commentsController.update(commentId, dto, jwt);

        assertEquals(updated, result);
        verify(commentsService).update(commentId, dto, jwt);
    }

    @Test
    void testDelete() {
        when(commentsService.delete(commentId, userId, jwt)).thenReturn(true);

        boolean result = commentsController.delete(commentId, userId, jwt);

        assertTrue(result);
        verify(commentsService).delete(commentId, userId, jwt);
    }

    @Test
    void testRemove() {
        when(commentsService.remove(commentId, userId, jwt)).thenReturn(true);

        boolean result = commentsController.remove(commentId, userId, jwt);

        assertTrue(result);
        verify(commentsService).remove(commentId, userId, jwt);
    }
}
