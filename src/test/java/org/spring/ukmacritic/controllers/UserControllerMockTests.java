package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.ukmacritic.dto.UserCreateDto;
import org.spring.ukmacritic.dto.UserResponseDto;
import org.spring.ukmacritic.dto.UserTestDto;
import org.spring.ukmacritic.dto.UserUpsertDto;
import org.spring.ukmacritic.services.UserService;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerMockTests {
    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    void createUser_ShouldReturnUuid() {
        UUID id = UUID.randomUUID();
        when(userService.create(any(UserUpsertDto.class))).thenReturn(id);

        UUID result = userController.create(new UserUpsertDto(
                "alice@mail.com", "1234", "alice",
                "Alice Smith", false));

        assertThat(result).isEqualTo(id);
        verify(userService).create(any(UserUpsertDto.class));
    }

    @Test
    void getAllUsers_ShouldReturnList() {
        List<UserTestDto> users = List.of(
                new UserTestDto(
                        UUID.randomUUID(), "alice@mail.com", "1234", "alice",
                        "Alice Smith", false
                ),
                new UserTestDto(
                        UUID.randomUUID(), "anna_may@gmail.com", "password", "anna_may",
                        "Anna May", false
                )
        );
        when(userService.getAll()).thenReturn(users);

        List<UserTestDto> result = userController.getAllUsers();

        assertThat(result).hasSize(2)
                .extracting("login")
                .containsExactly("alice", "anna_may");

        verify(userService).getAll();
    }

    @Test
    void createUser_ShouldCallServiceOnce() {
        UUID id = UUID.randomUUID();
        when(userService.create(any(UserUpsertDto.class))).thenReturn(id);

        userController.create(new UserUpsertDto("x@mail.com", "pwd", "x", "X User", false));
        userController.create(new UserUpsertDto("y@mail.com", "pwd", "y", "Y User", false));

        verify(userService, times(2)).create(any(UserUpsertDto.class));
    }

    @Test
    void updateUser_ShouldCallServiceWithCorrectArgs() {
        UUID id = UUID.randomUUID();
        UserUpsertDto dto = new UserUpsertDto(
                "updated@mail.com",
                "newpass",
                "updatedLogin",
                "Updated User",
                true
        );
        userController.update(id, dto);
        verify(userService, times(1)).update(eq(id), eq(dto));
    }

    @Test
    void deleteUser_ShouldReturnNoContent() {
        UUID id = UUID.randomUUID();

        boolean response = userController.delete(id);

        assertThat(response).isEqualTo(false); // because there is no user with this id to delete
        verify(userService).delete(eq(id));
    }
}
