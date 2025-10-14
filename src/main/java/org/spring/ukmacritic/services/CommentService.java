package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.entities.Comment;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.spring.ukmacritic.repos.CommentRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.stereotype.Service;

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

    public UUID create(CommentCreateDto c){

        var user = userRepo.findById(c.userId()).orElseThrow(() -> new IllegalArgumentException("User with id " + c.userId() + " is not found"));
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

    public CommentResponseDto update(UUID id, CommentUpdateDto c){
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        comment.setRating(c.rating());
        comment.setInfo(c.info());
        comment.setCreationDate(OffsetDateTime.now());

        commentRepo.saveAndFlush(comment);
        return commentEntityToTestDto(comment);
    }

    public boolean delete(UUID commentId, UUID managerId) {

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
