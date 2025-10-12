package org.spring.ukmacritic.controllers;

import org.junit.jupiter.api.Test;
import org.spring.ukmacritic.entities.User;
import org.spring.ukmacritic.repos.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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

    /*@Test
    void createAndUpdateUser_ShouldPersistAndBeFoundInDb() throws Exception {
        MvcResult result = mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                            {
                              "email": "anna_yes@mail.com",
                              "password": "my_name_is_anna",
                              "login": "anna_yes",
                              "name": "Anna Surname",
                              "state": false
                            }
                        """))
                .andExpect(status().isOk())
                .andReturn();

        String idString = result.getResponse().getContentAsString().replace("\"", "");
        UUID id = UUID.fromString(idString);

        Optional<User> userOpt = userRepository.findById(id);
        assertThat(userOpt)
                .isPresent()
                .get()
                .extracting(User::getEmail)
                .isEqualTo("anna_yes@mail.com");

        User user = userOpt.get();
        System.out.println("Created user: " + user);

        mockMvc.perform(put("/users/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "email": "anna_no@mail.com",
                          "password": "new_pass",
                          "login": "anna_yes",
                          "name": "Anna Surname And Patronymic",
                          "state": false
                        }
                    """))
                .andExpect(status().isOk());

        User updatedUser = userRepository.findById(id).orElseThrow();
        assertThat(updatedUser.getEmail()).isEqualTo("anna_no@mail.com");
        assertThat(updatedUser.getName()).isEqualTo("Anna Surname And Patronymic");
        assertThat(updatedUser.isState()).isFalse();

        System.out.println("Updated user: " + updatedUser);
    }*/
}
