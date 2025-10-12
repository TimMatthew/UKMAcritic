package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.ukmacritic.dto.user.UserCreateDto;
import org.spring.ukmacritic.dto.user.UserTestDto;
import org.spring.ukmacritic.dto.user.UserUpdateDto;
import org.spring.ukmacritic.services.UserService;

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
        when(userService.create(any(UserCreateDto.class))).thenReturn(id);

        UUID result = userController.create(new UserCreateDto(
                "alice@mail.com", "pwd","alice",
                "Alice Smith", false));

        assertThat(result).isEqualTo(id);
        verify(userService).create(any(UserCreateDto.class));
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
        when(userService.create(any(UserCreateDto.class))).thenReturn(id);

        userController.create(new UserCreateDto("x@mail.com", "pwd", "x", "X User", false));
        userController.create(new UserCreateDto("y@mail.com","pwd", "y", "Y User", false));

        verify(userService, times(2)).create(any(UserCreateDto.class));
    }

    @Test
    void updateUser_ShouldCallServiceWithCorrectArgs() {
        UUID id = UUID.randomUUID();
        UserUpdateDto dto = new UserUpdateDto(
                "updated@mail.com",
                "updatedLogin"
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
