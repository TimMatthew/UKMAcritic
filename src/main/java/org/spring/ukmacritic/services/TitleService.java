package org.spring.ukmacritic.services;

import io.jsonwebtoken.Claims;
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

        var titleEntity = Title.builder()
                .directors(title.directors())
                .genres(title.genres())
                .actors(title.actors())
                .regions(title.regions())
                .titleName(title.titleName())
                .overview(title.overview())
                .releaseYear(title.releaseYear())
                .rating(title.rating())
                .idTmdb(title.tmdb())
                .imageUrl(title.tmdb_image_url())
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

        title.setDirectors(dto.directors());
        title.setGenres(dto.genres());
        title.setActors(dto.actors());
        title.setRegions(dto.regions());
        title.setTitleName(dto.titleName());
        title.setOverview(dto.overview());
        title.setReleaseYear(dto.releaseYear());
        title.setIdTmdb(dto.tmdb());
        title.setImageUrl(dto.tmdb_image_url());

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
                .directors(t.getDirectors())
                .genres(t.getGenres())
                .actors(t.getActors())
                .regions(t.getRegions())
                .titleName(t.getTitleName())
                .overview(t.getOverview())
                .releaseYear(t.getReleaseYear())
                .tmdb(t.getIdTmdb())
                .tmdb_image_url(t.getImageUrl())
                .build();
    }

    private TitleResponseDto titleEntityToResponseDTO(Title t){
        return TitleResponseDto.builder()
                .id(t.getTitleId())
                .directors(t.getDirectors())
                .genres(t.getGenres())
                .actors(t.getActors())
                .regions(t.getRegions())
                .titleName(t.getTitleName())
                .overview(t.getOverview())
                .releaseYear(t.getReleaseYear())
                .tmdb(t.getIdTmdb())
                .tmdb_image_url(t.getImageUrl())
                .build();
    }
}
