package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.spring.ukmacritic.dto.UserCreateDto;
import org.spring.ukmacritic.dto.UserTestDto;
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
        when(userService.createUser(any(UserCreateDto.class))).thenReturn(id);

        UUID result = userController.create(new UserCreateDto(
                "alice@mail.com", "1234", "alice",
                "Alice Smith", false));

        assertThat(result).isEqualTo(id);
        verify(userService).createUser(any(UserCreateDto.class));
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
        when(userService.getAllUsers()).thenReturn(users);

        List<UserTestDto> result = userController.getAllUsers();

        assertThat(result).hasSize(2)
                .extracting("login")
                .containsExactly("alice", "anna_may");

        verify(userService).getAllUsers();
    }

    @Test
    void createUser_ShouldCallServiceOnce() {
        UUID id = UUID.randomUUID();
        when(userService.createUser(any(UserCreateDto.class))).thenReturn(id);

        userController.create(new UserCreateDto("x@mail.com", "pwd", "x", "X User", false));
        userController.create(new UserCreateDto("y@mail.com", "pwd", "y", "Y User", false));

        verify(userService, times(2)).createUser(any(UserCreateDto.class));
    }
}
