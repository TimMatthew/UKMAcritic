package org.spring.ukmacritic.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.dto.user.UserRegisterDto;
import org.spring.ukmacritic.dto.user.UserTestDto;
import org.spring.ukmacritic.dto.user.UserUpdateDto;
import org.spring.ukmacritic.entities.Comment;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.CommentRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.JWTUtils;
import org.spring.ukmacritic.services.UserService;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
class CommentsServiceMockTests {

    @Mock
    private CommentRepo commentRepository;

    @Mock
    private JWTUtils jwtUtil;

    @InjectMocks
    private CommentService commentService;

    @Mock
    private UserRepo userRepo;

    @Mock
    private TitleRepo titleRepo;

    private UUID commentId;
    private String jwt;
    private OffsetDateTime createdDate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        commentId = UUID.randomUUID();
        jwt = "fake-jwt";
        createdDate = OffsetDateTime.now();
    }

    @Test
    void testCreate() {
        UUID userId = UUID.randomUUID();
        UUID titleId = UUID.randomUUID();
        CommentCreateDto dto = new CommentCreateDto(userId.toString(), titleId.toString(), (byte) 5, "GREAT FILM!");

        when(jwtUtil.extractUserId(jwt)).thenReturn(String.valueOf(userId));
        User user = new User();
        user.setUserId(userId);
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        Title title = new Title();
        title.setTitleId(titleId);
        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));

        Comment comment = new Comment(commentId, user, title, createdDate, (byte) 5, "GREAT FILM!");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        CommentResponseDto result = commentService.get(commentId);
        assertEquals(commentId, result.id());
        assertEquals("GREAT FILM!", result.info());
        assertEquals(userId, result.userId());
        assertEquals(titleId, result.titleId());

        verify(commentRepository, times(1)).findById(commentId);
        verifyNoMoreInteractions(commentRepository);
    }
}
