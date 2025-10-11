package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.UserCreateDto;
import org.spring.ukmacritic.dto.UserTestDto;
import org.spring.ukmacritic.dto.UserUpsertDto;
import org.spring.ukmacritic.dto.UserResponseDto;
import org.spring.ukmacritic.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    private final UserService us;

    @PostMapping()
    public UUID create(@RequestBody UserCreateDto user){
        return us.createUser(user);
    }

    @GetMapping()
    public List<UserTestDto> getAllUsers(){
        return us.getAllUsers();
    }

    @GetMapping("{id}")
    public UserTestDto getUser(@PathVariable UUID id){
        return us.getUser(id);
    }
}
