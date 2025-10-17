package org.spring.ukmacritic.repos;

import org.spring.ukmacritic.entities.FavouriteTitle;
import org.spring.ukmacritic.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavouriteRepo extends JpaRepository<FavouriteTitle, UUID> {
    boolean existsByFavId(UUID id);

    List<FavouriteTitle> findAllByUser(User user);
}
