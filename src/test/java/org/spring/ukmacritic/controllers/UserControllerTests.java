package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.Test;
import org.spring.ukmacritic.dto.UserTestDto;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.match.ContentRequestMatchers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepo userRepository;

    @Test
    void createUser_ShouldPersistAndBeFoundInDb() throws Exception {
        MvcResult result = mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "email": "olga_meee@mail.com",
                              "password": "here_may_be_yours_reclama",
                              "login": "olga_meee",
                              "name": "Olga Medowes",
                              "state": true
                            }
                        """))
                .andExpect(status().isOk())
                .andReturn();

        String idString = result.getResponse().getContentAsString().replace("\"", "");
        UUID id = UUID.fromString(idString);

        Optional<User> userOpt = userRepository.findById(id);
        assertThat(userOpt).isPresent();

        User user = userOpt.get();
        assertThat(user.getEmail()).isEqualTo("olga_meee@mail.com");
        assertThat(user.getLogin()).isEqualTo("olga_meee");

        System.out.println(user);
    }
}
