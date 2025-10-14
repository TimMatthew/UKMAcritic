package org.spring.ukmacritic.services;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.user.*;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.PasswordUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final PasswordUtils pwdUtils;

    public UserResponseDto authenticate(UserAuthDto dto) {
        var user = userRepo.findByLogin(dto.login())
                .orElseThrow(() -> new IllegalArgumentException("User with login " + dto.login() + " not found"));

        if (!pwdUtils.matchPassword(dto.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        return userEntityToResponseDTO(user);
    }

    public UUID create(UserRegisterDto user){

        if(userRepo.existsByEmail(user.email()))
            throw new IllegalArgumentException("User with the following email already exists");
        if(userRepo.existsByLogin(user.login()))
            throw new IllegalArgumentException("User with the following email already exists");

        var userEntity = User.builder()
                .email(user.email())
                .password(pwdUtils.hash(user.password()))
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

    public User getEntity(UUID userId){

        return userRepo.findById(userId).orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " is not found"));
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
                .password(u.getPassword())
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

    public UserProfileDto userEntityToProfileDTO(User u){
        return UserProfileDto.builder()
                .userId(u.getUserId())
                .login(u.getLogin())
                .email(u.getEmail())
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
