package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.user.UserCreateDto;
import org.spring.ukmacritic.dto.user.UserTestDto;
import org.spring.ukmacritic.dto.user.UserUpdateDto;
import org.spring.ukmacritic.dto.user.UserResponseDto;
import org.spring.ukmacritic.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    private final UserService us;

    @PostMapping()
    public UUID create(@RequestBody UserCreateDto user){
        return us.create(user);
    }

    @GetMapping()
    public List<UserTestDto> getAllUsers(){
        return us.getAll();
    }

    @GetMapping("{id}")
    public UserResponseDto getUser(@PathVariable UUID id){
        return us.get(id);
    }

    @PutMapping("{id}")
    public UserResponseDto update(@PathVariable UUID id, @RequestBody UserUpdateDto dto){
        return us.update(id, dto);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id){
        return us.delete(id);
    }
}
