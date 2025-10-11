package org.spring.ukmacritic.services;


import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.UserCreateDto;
import org.spring.ukmacritic.dto.UserTestDto;
import org.spring.ukmacritic.dto.UserUpsertDto;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepo userRepo;

    public UUID createUser(UserCreateDto user){

        var userEntity = User.builder()
                .email(user.email())
                .password(user.password())
                .login(user.login())
                .name(user.name())
                .state(user.state())
                .build();

        userEntity = userRepo.saveAndFlush(userEntity);

        return userEntity.getUserId();

    }



    public List<UserTestDto> getAllUsers(){
        return userRepo.findAll().stream()
                .map(this::userEntityToTestDTO)
                .toList();
    }

    public UserTestDto getUser(UUID userId){
        var user = userRepo.findById(userId).orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " is not found"));

        return userEntityToTestDTO(user);
    }

    private UserTestDto userEntityToTestDTO(User u){
        return UserTestDto.builder()
                .id(u.getUserId())
                .email(u.getEmail())
                .password(u.getLogin())
                .login(u.getLogin())
                .name(u.getName())
                .state(u.isState())
                .build();

    }
}
