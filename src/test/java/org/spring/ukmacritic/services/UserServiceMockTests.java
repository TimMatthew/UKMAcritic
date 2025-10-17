package org.spring.ukmacritic.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.spring.ukmacritic.dto.user.*;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.spring.ukmacritic.security.JWTUtils;
import org.spring.ukmacritic.security.PasswordUtils;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class UserServiceMockTests {
    @Mock
    private UserRepo userRepo;

    @Mock
    private PasswordUtils pwdUtils;

    @InjectMocks
    private UserService userService;

    private String login = "testUser";
    private String password = "pass123";
    private UUID userId;

    @Mock
    private JWTUtils jwt;

    private String jwtToken;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userId = UUID.randomUUID();
        jwtToken = "fake-token";
    }

    @Test
    void testAuthenticateSuccess() {
        User user = new User();
        user.setLogin(login);
        user.setPassword("encodedPass");

        UserAuthDto dto = new UserAuthDto(login, password);

        when(userRepo.findByLogin(login)).thenReturn(Optional.of(user));
        when(pwdUtils.matchPassword(password, user.getPassword())).thenReturn(true);

        UserResponseDto result = userService.authenticate(dto);

        assertNotNull(result);
        assertEquals(login, result.login());
        verify(userRepo).findByLogin(login);
        verify(pwdUtils).matchPassword(password, user.getPassword());
    }

    @Test
    void testAuthenticateUserNotFound() {
        UserAuthDto dto = new UserAuthDto(login, password);

        when(userRepo.findByLogin(login)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userService.authenticate(dto));
        assertEquals("User with login " + login + " not found", ex.getMessage());

        verify(userRepo).findByLogin(login);
        verifyNoMoreInteractions(pwdUtils);
    }

    @Test
    void testAuthenticateInvalidPassword() {
        User user = new User();
        user.setLogin(login);
        user.setPassword("encodedPass");

        UserAuthDto dto = new UserAuthDto(login, password);

        when(userRepo.findByLogin(login)).thenReturn(Optional.of(user));
        when(pwdUtils.matchPassword(password, user.getPassword())).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> userService.authenticate(dto));
        assertEquals("Invalid password", ex.getMessage());

        verify(userRepo).findByLogin(login);
        verify(pwdUtils).matchPassword(password, user.getPassword());
    }

    @Test
    void testCreateSuccess() {
        UserRegisterDto dto = new UserRegisterDto("test@example.com", "testUser",
                "password", "Test", true);

        when(userRepo.existsByEmail(dto.email())).thenReturn(false);
        when(userRepo.existsByLogin(dto.login())).thenReturn(false);
        when(pwdUtils.hash(dto.password())).thenReturn("hashedPassword");

        User userEntity = User.builder()
                .userId(userId)
                .email(dto.email())
                .login(dto.login())
                .password("hashedPassword")
                .name(dto.name())
                .state(dto.state())
                .build();

        when(userRepo.saveAndFlush(any(User.class))).thenReturn(userEntity);

        UUID result = userService.create(dto);

        assertEquals(userId, result);
        verify(userRepo).existsByEmail(dto.email());
        verify(userRepo).existsByLogin(dto.login());
        verify(userRepo).saveAndFlush(any(User.class));
        verify(pwdUtils).hash(dto.password());
    }

    @Test
    void testGetSuccess() {
        User user = new User();
        user.setUserId(userId);
        user.setEmail("test@example.com");

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        UserResponseDto result = userService.get(userId);

        assertEquals(userId, result.userId());
        verify(userRepo).findById(userId);
    }

    @Test
    void testUpdateSuccess() {
        User user = new User();
        user.setUserId(userId);
        user.setName("OldName");
        user.setLogin("OldLogin");

        UserUpdateDto dto = new UserUpdateDto("NewLogin", "NewName");

        when(jwt.extractUserId(jwtToken)).thenReturn(userId.toString());
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        UserResponseDto result = userService.update(userId, dto, jwtToken);

        assertEquals("NewName", result.userName());
        assertEquals("NewLogin", result.login());
        verify(userRepo).saveAndFlush(user);
    }

    @Test
    void testDeleteSuccess() {
        User user = new User();
        user.setUserId(userId);

        when(jwt.extractRole(jwtToken)).thenReturn("true");
        when(jwt.extractUserId(jwtToken)).thenReturn(userId.toString());
        when(userRepo.findById(userId)).thenReturn(Optional.of(user));

        boolean result = userService.delete(userId, jwtToken);

        assertTrue(result);
        verify(userRepo).delete(user);
    }
}
