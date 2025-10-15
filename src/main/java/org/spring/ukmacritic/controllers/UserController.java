package org.spring.ukmacritic.controllers;

import lombok.RequiredArgsConstructor;
import org.spring.ukmacritic.dto.user.*;
import org.spring.ukmacritic.services.UserService;
import org.spring.ukmacritic.security.JWTUtils;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    private final UserService us;
    private final JWTUtils jwt;

    @PostMapping("login")
    public ResponseEntity<?> authenticate(@RequestBody UserAuthDto dto){
        //return us.authenticate(dto);
        var user = us.authenticate(dto);
        var token = jwt.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(60 * 60) // 1 hour
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header("Set-Cookie", cookie.toString())
                .body(Map.of("token", token));
    }

    @GetMapping("profile")
    public ResponseEntity<?> getCurrentUser(@CookieValue("jwt") String token) {

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).body("No JWT cookie found");
        }
        var userId = jwt.extractUserId(token);
        var user = us.userEntityToProfileDTO(us.getEntity(UUID.fromString(userId)));
        return ResponseEntity.ok(user);
    }

    @PostMapping()
    public UUID create(@RequestBody UserRegisterDto user){
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
    public UserResponseDto update(@PathVariable UUID id, @RequestBody UserUpdateDto dto, @CookieValue("jwt") String token){
        return us.update(id, dto, token);
    }

    @DeleteMapping("{id}")
    public boolean delete(@PathVariable UUID id, @CookieValue("jwt") String token){
        return us.delete(id, token);
    }
}
