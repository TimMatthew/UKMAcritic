package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.favourites.FavCreateDto;
import org.spring.ukmacritic.dto.favourites.FavResponseDto;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.services.FavouriteService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("favs")
public class FavouritesController {

    private final FavouriteService fs;

    @PostMapping
    public UUID create(@RequestBody FavCreateDto f, @CookieValue(name = "jwt") String token){
        return fs.create(f, token);
    }

    @GetMapping("{id}")
    public List<FavResponseDto> getAll(@PathVariable UUID id){
        return fs.getAll(id);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id, @CookieValue(name = "jwt") String token){
        return fs.delete(id, token);
    }


}
