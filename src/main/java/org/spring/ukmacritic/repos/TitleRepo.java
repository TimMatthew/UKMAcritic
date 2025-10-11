package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.Title;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface TitleRepo extends JpaRepository<Title, UUID> {
    
}
