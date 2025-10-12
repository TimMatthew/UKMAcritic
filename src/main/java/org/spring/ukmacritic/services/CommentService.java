package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentTestDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.entities.Comment;
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

    public CommentTestDto get(UUID id){
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        return commentEntityToTestDto(comment);
    }

    public List<CommentTestDto> getAll(){

        return commentRepo.findAll().stream()
                .map(this::commentEntityToTestDto)
                .toList();
    }

    public CommentTestDto update(UUID id, CommentUpdateDto c){
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        comment.setRating(c.rating());
        comment.setInfo(c.info());
        comment.setCreationDate(OffsetDateTime.now());

        commentRepo.saveAndFlush(comment);
        return commentEntityToTestDto(comment);
    }

    public boolean delete (UUID id){
        var comment = commentRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Comment with id " + id + " is not found"));

        commentRepo.delete(comment);
        return true;
    }

    public CommentTestDto commentEntityToTestDto(Comment c){

        return CommentTestDto.builder()
                .id(c.getCommentId())
                .userId(c.getUser().getUserId())
                .titleId(c.getTitle().getTitleId())
                .creationDate(c.getCreationDate())
                .rating(c.getRating())
                .info(c.getInfo())
                .build();
    }
}
