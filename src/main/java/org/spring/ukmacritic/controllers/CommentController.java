package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.services.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("comments")
public class CommentController {

    private final CommentService cs;

    @PostMapping
    public UUID create(@RequestBody CommentCreateDto title) {
        return cs.create(title);
    }

    @GetMapping("{id}")
    public CommentResponseDto get(@PathVariable UUID id){
        return cs.get(id);
    }

    @GetMapping
    public List<CommentResponseDto> getAll(){
        return cs.getAll();
    }

    @GetMapping("user/{userId}")
    public List<CommentResponseDto> getAllByUser(@PathVariable UUID userId){
        return cs.getAllByUser(userId);
    }

    @GetMapping("title/{titleId}")
    public List<CommentResponseDto> getAllByTitle(@PathVariable UUID titleId){
        return cs.getAllByTitle(titleId);
    }


    @PutMapping("{id}")
    public CommentResponseDto update(@PathVariable UUID id, @RequestBody CommentUpdateDto dto){
        return cs.update(id, dto);
    }

    @DeleteMapping("{comment}/{manager}")
    public boolean delete(@PathVariable UUID comment, @PathVariable UUID manager){
        return cs.delete(comment, manager);
    }



}
