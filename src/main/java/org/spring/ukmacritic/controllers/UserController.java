package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
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
    public UUID create(@RequestBody UserUpsertDto user){
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
    public UserUpsertDto update(@PathVariable UUID id, @RequestBody UserUpsertDto dto){
        return us.update(id, dto);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id){
        return us.delete(id);
    }
}
