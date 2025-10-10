package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.Comment;
import org.spring.ukmacritic.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface CommentRepo extends JpaRepository<Comment, UUID> {
    
}
