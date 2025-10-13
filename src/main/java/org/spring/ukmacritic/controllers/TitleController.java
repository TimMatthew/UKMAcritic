package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.title.TitleUpsertDto;
import org.spring.ukmacritic.services.TitleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("titles")
@RequiredArgsConstructor
public class TitleController {

    private final TitleService titleService;

    @PostMapping
    public UUID create(@RequestBody TitleUpsertDto title) {
        return titleService.create(title);
    }

    @GetMapping("{id}")
    public TitleUpsertDto get(@PathVariable UUID id) {
        return titleService.get(id);
    }

    @GetMapping
    public List<TitleUpsertDto> getAll() {
        return titleService.getAll();
    }

    @PutMapping("{id}")
    public TitleUpsertDto update(@PathVariable UUID id, @RequestBody TitleUpsertDto dto) {
        return titleService.update(id, dto);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id) {
        return titleService.delete(id);
    }
}
