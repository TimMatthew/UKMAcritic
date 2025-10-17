package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.FavouriteTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FavouriteRepo extends JpaRepository<FavouriteTitle, UUID> {

}
