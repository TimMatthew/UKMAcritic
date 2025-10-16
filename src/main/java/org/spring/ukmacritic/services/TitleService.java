package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.dto.title.TitleUpsertDto;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.security.JWTUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TitleService {

    private final TitleRepo titleRepo;
    private final JWTUtils jwt;

    public UUID create(TitleUpsertDto title, String token){

        String roleFromToken = jwt.extractRole(token);

        if(roleFromToken.equals("false"))
            throw new IllegalArgumentException("You are not allowed to perform this action!");

        String tmdb = generateUniqueTmdbId();

        var titleEntity = Title.builder()
                .tmdbId(tmdb)
                .titleName(title.titleName())
                .overview(title.overview())
                .keywords(title.keywords())
                .genres(title.genres())
                .actors(title.actors())
                .director(title.director())
                .releaseYear(title.releaseYear())
                .rating(title.rating())
                .imageUrl(title.imageUrl())
                .build();

        titleEntity = titleRepo.saveAndFlush(titleEntity);

        return titleEntity.getTitleId();
    }

    public TitleResponseDto get(UUID id){
        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Title with id " + id + " is not found"));
        return titleEntityToResponseDTO(title);
    }

    public List<TitleResponseDto> getAll(){
        return titleRepo.findAll().stream()
                .map(this::titleEntityToResponseDTO)
                .toList();
    }

    public TitleUpsertDto update(UUID id, TitleUpsertDto dto, String token){

        String roleFromToken = jwt.extractRole(token);

        if(roleFromToken.equals("false"))
            throw new IllegalArgumentException("You are not allowed to perform this action!");

        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Title with id " + id + " is not found"));

        title.setTitleName(dto.titleName());
        title.setOverview(dto.overview());
        title.setKeywords(dto.keywords());
        title.setGenres(dto.genres());
        title.setActors(dto.actors());
        title.setDirector(dto.director());
        title.setReleaseYear(dto.releaseYear());
        title.setRating(dto.rating());
        title.setImageUrl(dto.imageUrl());

        titleRepo.saveAndFlush(title);

        return titleEntityToUpsertDTO(title);
    }

    public boolean delete(UUID id, String token){

        String roleFromToken = jwt.extractRole(token);

        if(roleFromToken.equals("false"))
            throw new IllegalArgumentException("You are not allowed to perform this action!");

        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Title with id " + id + " is not found"));
        titleRepo.delete(title);

        return true;
    }


    // --------------------------- HELPERS ---------------------------
    private TitleUpsertDto titleEntityToUpsertDTO(Title t){
        return TitleUpsertDto.builder()
                .titleName(t.getTitleName())
                .overview(t.getOverview())
                .keywords(t.getKeywords())
                .genres(t.getGenres())
                .actors(t.getActors())
                .director(t.getDirector())
                .releaseYear(t.getReleaseYear())
                .rating(t.getRating())
                .imageUrl(t.getImageUrl())
                .build();
    }

    private TitleResponseDto titleEntityToResponseDTO(Title t){
        return TitleResponseDto.builder()
                .id(t.getTitleId())
                .titleName(t.getTitleName())
                .overview(t.getOverview())
                .keywords(t.getKeywords())
                .genres(t.getGenres())
                .actors(t.getActors())
                .director(t.getDirector())
                .releaseYear(t.getReleaseYear())
                .rating(t.getRating())
                .imageUrl(t.getImageUrl())
                .build();
    }

    private String generateUniqueTmdbId() {
        String tmdbId;
        do {
            long randomNumber = (long) (Math.random() * 1_000_000L);
            tmdbId = String.valueOf(randomNumber);
        } while (titleRepo.existsByTmdbId(tmdbId));

        return tmdbId;
    }

}
