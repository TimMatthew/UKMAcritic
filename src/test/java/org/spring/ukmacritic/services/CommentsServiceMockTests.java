package org.spring.ukmacritic.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.entities.Comment;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.CommentRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.JWTUtils;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class CommentsServiceMockTests {

    @Mock
    private CommentRepo commentRepo;

    @Mock
    private JWTUtils jwtUtil;

    @InjectMocks
    private CommentService commentService;

    @Mock
    private UserRepo userRepo;

    @Mock
    private TitleRepo titleRepo;

    @Mock
    private JavaMailSender mailSender;

    private UUID commentId;
    private String jwtToken;
    private OffsetDateTime createdDate;
    private UUID userId;
    private UUID titleId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        commentId = UUID.randomUUID();
        jwtToken = "fake-jwt";
        createdDate = OffsetDateTime.now();
        userId = UUID.randomUUID();
        titleId = UUID.randomUUID();
    }

    @Test
    void testCreate() {
        CommentCreateDto dto = new CommentCreateDto(userId.toString(), titleId.toString(), (byte) 5, "GREAT FILM!");

        when(jwtUtil.extractUserId(jwtToken)).thenReturn(String.valueOf(userId));
        User user = new User();
        user.setUserId(userId);
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        Title title = new Title();
        title.setTitleId(titleId);
        when(titleRepo.findById(titleId)).thenReturn(Optional.of(title));

        Comment comment = new Comment(commentId, user, title, createdDate, (byte) 5, "GREAT FILM!");

        when(commentRepo.findById(commentId)).thenReturn(Optional.of(comment));

        CommentResponseDto result = commentService.get(commentId);
        assertEquals(commentId, result.id());
        assertEquals("GREAT FILM!", result.info());
        assertEquals(userId, result.userId());
        assertEquals(titleId, result.titleId());

        verify(commentRepo, times(1)).findById(commentId);
        verifyNoMoreInteractions(commentRepo);
    }

    @Test
    void testGetCommentSuccess() {
        User user = new User();
        user.setUserId(userId);

        Title title = new Title();
        title.setTitleId(titleId);

        Comment comment = new Comment(commentId, user, title, createdDate, (byte) 5, "GREAT FILM!");

        when(commentRepo.findById(commentId)).thenReturn(Optional.of(comment));

        CommentResponseDto result = commentService.get(commentId);

        assertEquals(commentId, result.id());
        verify(commentRepo).findById(commentId);
    }

    @Test
    void testUpdateCommentSuccess() {
        User user = new User();
        user.setUserId(userId);

        Title title = new Title();
        title.setTitleId(titleId);

        Comment comment = new Comment(commentId, user, title, OffsetDateTime.now(), (byte)4, "Old review");
        CommentUpdateDto dto = new CommentUpdateDto(user, (byte)5, "New review");

        when(jwtUtil.extractUserId(jwtToken)).thenReturn(userId.toString());
        when(jwtUtil.extractRole(jwtToken)).thenReturn("false");
        when(commentRepo.findById(commentId)).thenReturn(Optional.of(comment));
        when(userRepo.findById(commentId)).thenReturn(Optional.of(user));

        CommentResponseDto result = commentService.update(commentId, dto, jwtToken);

        assertEquals("New review", result.info());
        assertEquals(5, result.rating());
        verify(commentRepo).saveAndFlush(comment);
    }

    @Test
    void testDeleteCommentByManager() {
        User manager = new User(); manager.setUserId(userId); manager.setState(true);
        User commentAuthor = new User(); commentAuthor.setUserId(UUID.randomUUID());
        Comment comment = new Comment(commentId, commentAuthor, null, OffsetDateTime.now(), (byte)5, "Info");

        when(jwtUtil.extractUserId(jwtToken)).thenReturn(userId.toString());
        when(userRepo.findById(userId)).thenReturn(Optional.of(manager));
        when(commentRepo.findById(commentId)).thenReturn(Optional.of(comment));

        boolean result = commentService.delete(commentId, userId, jwtToken);

        assertTrue(result);
        verify(mailSender).send(any(SimpleMailMessage.class));
        verify(commentRepo).delete(comment);
    }

}
