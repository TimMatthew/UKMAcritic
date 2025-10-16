package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.Title;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TitleRepo extends JpaRepository<Title, UUID> {

    public boolean existsByTmdbId(String id);
}
