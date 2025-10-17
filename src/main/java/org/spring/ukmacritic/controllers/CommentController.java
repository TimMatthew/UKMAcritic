package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentResponseDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.services.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("comments")
public class CommentController {

    private final CommentService cs;

    @PostMapping
    public UUID create(@RequestBody CommentCreateDto title, @CookieValue(name="jwt") String jwtToken) {
        return cs.create(title, jwtToken);
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
    public CommentResponseDto update(@PathVariable UUID id, @RequestBody CommentUpdateDto dto, @CookieValue(name="jwt") String jwtToken){
        return cs.update(id, dto, jwtToken);
    }

    @DeleteMapping("delete/{comment}/{manager}")
    public boolean delete(@PathVariable UUID comment, @PathVariable UUID manager, @CookieValue(name="jwt") String jwtToken){
        return cs.delete(comment, manager, jwtToken);
    }

    @DeleteMapping("remove/{comment}/{user}")
    public boolean remove(@PathVariable UUID comment, @PathVariable UUID user, @CookieValue(name="jwt") String jwtToken){
        return cs.remove(comment, user, jwtToken);
    }



}
