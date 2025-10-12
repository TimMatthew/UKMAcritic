package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.user.UserCreateDto;
import org.spring.ukmacritic.dto.user.UserResponseDto;
import org.spring.ukmacritic.dto.user.UserTestDto;
import org.spring.ukmacritic.dto.user.UserUpdateDto;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;

    public UUID create(UserCreateDto user){

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

    public List<UserTestDto> getAll(){
        return userRepo.findAll().stream()
                .map(this::userEntityToTestDTO)
                .toList();
    }

    public UserResponseDto get(UUID userId){
        var user = userRepo.findById(userId).orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " is not found"));

        return userEntityToResponseDTO(user);
    }

    public UserResponseDto update(UUID id, UserUpdateDto dto){
        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " is not found"));

        user.setName(dto.name());
        user.setLogin(dto.login());

        userRepo.saveAndFlush(user);
        return userEntityToResponseDTO(user);
    }

    public UserUpdateDto changePassword(UUID id, String pwd){
        return null;
    }

    public boolean delete(UUID id){
        var user = userRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " is not found"));
        userRepo.delete(user);
        return true;
    }

    // --------------------------- HELPERS ---------------------------

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

    private UserResponseDto userEntityToResponseDTO(User u){
        return UserResponseDto.builder()
                .userId(u.getUserId())
                .login(u.getLogin())
                .userName(u.getName())
                .state(u.isState())
                .build();
    }

//    private UserUpdateDto userEntityToUpdateDTO(User u){
//        return UserUpdateDto.builder()
//                .login(u.getLogin())
//                .name(u.getName())
//                .build();
//    }
}
