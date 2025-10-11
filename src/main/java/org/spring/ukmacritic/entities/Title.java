package org.spring.ukmacritic.entities;

import com.vladmihalcea.hibernate.type.array.ListArrayType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Builder
@Getter
@Setter
@Table(name = "title")
@RequiredArgsConstructor
public class Title {

    @Id
    @GeneratedValue
    @Column(name = "title_id")
    private UUID titleId;

    @Type(ListArrayType.class)
    @Column(
            name = "directors",
            columnDefinition = "text[]"
    )
    private ArrayList<String> directors;

    @Type(ListArrayType.class)
    @Column(
            name = "genres",
            columnDefinition = "text[]",
            nullable = false
    )
    private ArrayList<String> genres;

    @Type(ListArrayType.class)
    @Column(
            name = "actors",
            columnDefinition = "text[]"
    )
    private ArrayList<String> actors;

    @Type(ListArrayType.class)
    @Column(
            name = "regions",
            columnDefinition = "text[]"
    )
    private ArrayList<String> regions;

    @Column(
            name = "title_name",
            nullable = false,
            columnDefinition = "character varying"
    )
    private String titleName;

    @Column(
            name = "overview",
            columnDefinition = "text"
    )
    private String overview;

    @Column(name="release_year")
    private short releaseYear;

    @Column(name="rating")
    private byte rating;
}
