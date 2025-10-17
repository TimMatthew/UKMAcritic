package org.spring.ukmacritic.entities;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "favourites")
@RequiredArgsConstructor
@Getter
@Setter
@Builder
public class FavouriteTitle {
    @Id
    @GeneratedValue
    @Column(name = "fav_id", nullable = false)
    private UUID favId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "title_id", nullable = false)
    private Title title;
}
