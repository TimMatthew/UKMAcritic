package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.Comment;
import org.spring.ukmacritic.entities.Title;
import org.spring.ukmacritic.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface CommentRepo extends JpaRepository<Comment, UUID> {

    List<Comment> findAllByUser(User user);

    List<Comment> findAllByTitle(Title title);
    
}
