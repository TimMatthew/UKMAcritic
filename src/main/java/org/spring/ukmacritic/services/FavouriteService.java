package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.favourites.FavCreateDto;
import org.spring.ukmacritic.dto.favourites.FavResponseDto;
import org.spring.ukmacritic.dto.title.TitleResponseDto;
import org.spring.ukmacritic.entities.FavouriteTitle;
import org.spring.ukmacritic.repos.FavouriteRepo;
import org.spring.ukmacritic.repos.TitleRepo;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.JWTUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavouriteService {

    private final UserRepo ur;
    private final TitleRepo tr;
    private final TitleService ts;
    private final FavouriteRepo fr;
    private final JWTUtils jwt;

    public UUID create(FavCreateDto f, String token){

        if (token == null)
            throw new SecurityException("Please authenticate before this action!");
        if(Objects.equals(jwt.extractRole(token), "true"))
            throw new SecurityException("Access denied: only client are allowed to perform this action!");

        var title = tr.findById(f.titleId()).orElseThrow(() -> new SecurityException("Title with "+f.titleId()+" id is not found!"));
        var user = ur.findById(f.userId()).orElseThrow(() -> new SecurityException("User with "+f.userId()+" id is not found!"));

        var favouriteEntity = FavouriteTitle.builder()
                .user(user)
                .title(title)
                .build();

        favouriteEntity = fr.saveAndFlush(favouriteEntity);
        return favouriteEntity.getFavId();
    }

    public List<FavResponseDto> getAll(){
        return fr.findAll().stream()
                .map(this::favEntityToDto)
                .toList();
    }

    public boolean delete(UUID favId, String token){

        if (token == null)
            throw new SecurityException("Please authenticate before this action!");

        if(!fr.existsById(favId))
            throw new IllegalArgumentException("This titleId is not in your favourites!");

        fr.deleteById(favId);
        return true;

    }

    public FavResponseDto favEntityToDto(FavouriteTitle ft){
        return FavResponseDto.builder()
                .favId(ft.getFavId())
                .titleId(ft.getTitle().getTitleId())
                .userId(ft.getUser().getUserId())
                .build();
    }
}
