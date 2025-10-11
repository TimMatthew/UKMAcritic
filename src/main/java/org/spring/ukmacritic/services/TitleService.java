package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.TitleResponseDto;
import org.spring.ukmacritic.dto.TitleUpsertDto;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.repos.TitleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TitleService {

    private final TitleRepo titleRepo;

    public UUID create(TitleUpsertDto title){

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
                .build();

        titleEntity = titleRepo.saveAndFlush(titleEntity);

        return titleEntity.getTitleId();
    }

    public TitleUpsertDto get(UUID id){
        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Title with id " + id + " is not found"));
        return titleEntityToUpsertDTO(title);
    }

    public List<TitleUpsertDto> getAll(){
        return titleRepo.findAll().stream()
                .map(this::titleEntityToUpsertDTO)
                .toList();
    }

    public TitleUpsertDto update(UUID id, TitleUpsertDto dto){
        var title = titleRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Title with id " + id + " is not found"));

        title.setDirectors(dto.directors());
        title.setGenres(dto.genres());
        title.setActors(dto.actors());
        title.setRegions(dto.regions());
        title.setTitleName(dto.titleName());
        title.setOverview(dto.overview());
        title.setReleaseYear(dto.releaseYear());

        titleRepo.saveAndFlush(title);

        return titleEntityToUpsertDTO(title);
    }

    public boolean delete(UUID id){
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
                .build();
    }

    private TitleResponseDto titleEntityToResponseDTO(Title t){
        return TitleResponseDto.builder()

                .directors(t.getDirectors())
                .genres(t.getGenres())
                .actors(t.getActors())
                .regions(t.getRegions())
                .titleName(t.getTitleName())
                .overview(t.getOverview())
                .releaseYear(t.getReleaseYear())
                .tmdb(t.getIdTmdb())
                .build();
    }
}
