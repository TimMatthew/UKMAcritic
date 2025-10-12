package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.comment.CommentCreateDto;
import org.spring.ukmacritic.dto.comment.CommentTestDto;
import org.spring.ukmacritic.dto.comment.CommentUpdateDto;
import org.spring.ukmacritic.services.CommentService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    public CommentTestDto get(@PathVariable UUID id){
        return cs.get(id);
    }

    @GetMapping
    public List<CommentTestDto> getAll(){
        return cs.getAll();
    }

    @PutMapping("{id}")
    public CommentTestDto update(@PathVariable UUID id, @RequestBody CommentUpdateDto dto){
        return cs.update(id, dto);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id){
        return cs.delete(id);
    }


}
