package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.entities.Comment;
import org.spring.ukmacritic.security.JWTUtils;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.spring.ukmacritic.repos.CommentRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.events.Event;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepo commentRepo;
    private final UserRepo userRepo;
    private final TitleRepo titleRepo;
    private final JavaMailSender mailSender;
    private final JWTUtils jwtUtil;

    public UUID create(CommentCreateDto c){

        var user = userRepo.findById(c.userId()).orElseThrow(() -> new IllegalArgumentException("User with id " + c.userId() + " is not found"));

        if(user.isState()) throw new SecurityException("You are not allowed to perform this action!");

        var title = titleRepo.findById(c.titleId()).orElseThrow(() -> new IllegalArgumentException("Comment with id " + c.titleId() + " is not found"));

        var commentEntity = Comment.builder()
                .user(user)
                .title(title)
                .creationDate(OffsetDateTime.now())
                .rating(c.rating())
                .info(c.info())
                .build();

        commentEntity = commentRepo.saveAndFlush(commentEntity);

        return commentEntity.getCommentId();
    }

    public CommentResponseDto get(UUID id){
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        return commentEntityToTestDto(comment);
    }

    public List<CommentResponseDto> getAll(){

        return commentRepo.findAll().stream()
                .map(this::commentEntityToTestDto)
                .toList();
    }

    public List<CommentResponseDto> getAllByUser(UUID id){

        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " is not found"));

        return commentRepo.findAllByUser(user).stream()
                .map(this::commentEntityToTestDto)
                .toList();
    }

    public List<CommentResponseDto> getAllByTitle(UUID id){

        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " is not found"));

        return commentRepo.findAllByTitle(title).stream()
                .map(this::commentEntityToTestDto)
                .toList();
    }

    public CommentResponseDto update(UUID id, CommentUpdateDto c, String token){

        if (token == null)
            throw new SecurityException("User not authenticated.");

        String idFromToken = jwtUtil.extractUserId(token);
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        if(!String.valueOf(comment.getUser().getUserId()).equals(idFromToken))
            throw new SecurityException("Access denied: user ID does not match authenticated user!");

        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " is not found"));
        if(user.isState()) throw new SecurityException("You are not allowed to perform this action!");

        comment.setRating(c.rating());
        comment.setInfo(c.info());
        comment.setCreationDate(OffsetDateTime.now());

        commentRepo.saveAndFlush(comment);
        return commentEntityToTestDto(comment);
    }

    public boolean remove(UUID commentId, UUID userId, String token) {

        if (token == null)
            throw new SecurityException("User not authenticated.");

        String idFromToken = jwtUtil.extractUserId(token);

        var user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Manager with id " + userId + " is not found"));
        var comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + commentId + " is not found"));
        var userFromComment = comment.getUser();

        if (userFromComment == null)
            throw new IllegalStateException("Comment author not found.");
        if (!String.valueOf(userFromComment.getUserId()).equals(idFromToken))
            throw new SecurityException("Access denied: user ID does not match authenticated user!");
        if(user.isState())
            throw new SecurityException("Access denied: You do not have appropriate right to perform this action!");


        commentRepo.delete(comment);
        System.out.println("Comment "+commentId+" was successfully deleted!");

        return true;
    }

    public boolean delete(UUID commentId, UUID managerId, String token) {

        if (token == null)
            throw new SecurityException("User not authenticated.");

        String idFromToken = jwtUtil.extractUserId(token);

        var manager = userRepo.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager with id " + managerId + " is not found"));

        if (!String.valueOf(manager.getUserId()).equals(idFromToken))
            throw new SecurityException("Access denied: manager ID does not match authenticated user!");
        if(!manager.isState())
            throw new SecurityException("Access denied: You do not have appropriate right to perform this action!");

        var comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + commentId + " is not found"));

        var user = comment.getUser();
        if (user == null)
            throw new IllegalStateException("Comment author not found.");

        String email = user.getEmail();
        String info = comment.getInfo();

        sendCommentRemovalEmail(email, info);
        System.out.println("Letter to "+email+" was successfully delivered!");

        commentRepo.delete(comment);
        System.out.println("Comment "+commentId+" was successfully deleted!");

        return true;
    }

    public void sendCommentRemovalEmail(String recipient, String commentText) {
        String subject = "Your comment has been removed";
        String body = String.format("""
                Hello,

                Your comment has been removed by our moderation team for violating community guidelines.

                Comment text:
                "%s"

                Please review our comment policy before posting again.

                Sincerely,
                UKMAcritic Moderation Team
                """, commentText);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("vasylshlapak14@gmail.com");
        msg.setTo(recipient);
        msg.setSubject(subject);
        msg.setText(body);

        mailSender.send(msg);
    }

    public CommentResponseDto commentEntityToTestDto(Comment c){

        return CommentResponseDto.builder()
                .id(c.getCommentId())
                .userId(c.getUser().getUserId())
                .titleId(c.getTitle().getTitleId())
                .creationDate(c.getCreationDate())
                .rating(c.getRating())
                .info(c.getInfo())
                .build();
    }
}
