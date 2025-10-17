import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Client.css";
import {Link, useNavigate} from "react-router-dom";
import api from "../../api/AxiosConfig";
import {Card, Spinner} from "react-bootstrap";
import ReadMore from "../../films/ReadMore";
import RecommendationsSection from "./RecommendationsSection";
import {map} from "framer-motion/m";

export default function HomePageClient() {
    const [films, setFilms] = useState([]);
    // const [genres, setGenres] = useState([]);
    // const [selectedGenre, setSelectedGenre] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("title");

    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 12;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFilms();
        if (user?.userId) {
            loadFavorites();
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const loadFavorites = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${user.userId}`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setFavorites(data.map(item => item.titleId));
            } else {
                console.error("Error fetching favorites");
            }
        } catch (error) {
            console.error("Error fetching favourites:", error);
        }
        finally {
            setLoading(false);
        }
    }

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);

            // const allGenres = response.data.flatMap((item) => item.genres);
            // const uniqueGenres = [...new Set(allGenres)];
            // setGenres(uniqueGenres);
        } catch (err) {
            console.error("Failed to load films", err);
        }
    };

    const filteredFilms = films.filter((film) => {
        const query = search.toLowerCase().split(' ').join('');

        if (!search.trim()) return true;

        switch (searchField) {
            case "title":
                return film.titleName?.toLowerCase().includes(query);
            case "actors":
                return film.actors?.some((actor) =>
                    actor.toLowerCase().includes(query)
                );
            case "genres":
                return film.genres?.some((genre) =>
                    genre.toLowerCase().includes(query)
                );
            case "directors":
                return film.director?.some((dir) =>
                    dir.toLowerCase().includes(query)
                );
            default:
                return false;
        }
    });

    const toggleFavorite = async (filmId) => {
        const token = localStorage.getItem("site");

        if (favorites.includes(filmId)) {
            setFavorites(favorites.filter(id => id !== filmId));
            try {
                await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${filmId}`, {
                    method: "DELETE",
                    credentials: "include",
                });
            } catch (err) {
                console.error(err);
                setFavorites(prev => [...prev, filmId]);
            }
        } else {
            setFavorites([...favorites, filmId]);
            try {
                await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        titleId: filmId,
                        userId: JSON.parse(localStorage.getItem("user")).userId,
                    }),
                });
            } catch (err) {
                console.error(err);
                setFavorites(prev => prev.filter(id => id !== filmId));
            }
        }
    };

    const favouriteFilms = films.filter(film => favorites.includes(film.id));

    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${user.userId}`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("site")}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    console.error("Error fetching favorites");
                }
            } catch (error) {
                console.error("Error fetching favourites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user.userId]);

    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    console.log(favouriteFilms)

    return (
        <div className="container py-4">
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {/*<div className="flex flex-wrap gap-2 mt-4" style={{display: "flex", justifyContent: "center"}}>*/}
            {/*    {genres.map((genre) => (*/}
            {/*        <span*/}
            {/*            key={genre}*/}
            {/*            className={`genre-chip ${selectedGenre === genre ? "active" : ""}`}*/}
            {/*            onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}*/}
            {/*        >*/}
            {/*          {genre}*/}
            {/*        </span>*/}
            {/*    ))}*/}
            {/*</div>*/}


            {!loading && (
                <div>
                    <RecommendationsSection
                        key={favorites.length}
                        favoriteFilms={films.filter(f => favorites.includes(f.id))}
                        allFilms={films}
                    />

                    <div className="search-wrapper mb-4 d-flex flex-column flex-md-row align-items-md-center gap-2">
                        <div className="position-relative flex-grow-1">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input
                                type="text"
                                className="form-control ps-5"
                                placeholder={`Search by ${searchField}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className="form-select"
                            style={{ maxWidth: "180px" }}
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value)}
                        >
                            <option value="title">Title</option>
                            <option value="actors">Actors</option>
                            <option value="genres">Genres</option>
                            <option value="directors">Directors</option>
                        </select>
                    </div>

                    <h2 className="mt-5 mb-4">Other people also like</h2>
                    <div className="row">
                        {currentFilms.map((film) => (
                            <div key={film.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                                <Card
                                    className="h-100 shadow-sm film-card"
                                    style={{cursor: "pointer"}}
                                    onClick={() => navigate(`/user-page/films/info/${film.id}`)}
                                >
                                    <button
                                        className={`btn btn-sm position-absolute top-0 end-0 m-2 ${
                                            favouriteFilms.includes(film.id) ? "btn-danger" : "btn-outline-danger"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(film.id);
                                        }}
                                        title={favouriteFilms.includes(film.id) ? "Delete from favorites" : "Add to favourites"}
                                    >
                                        ❤️
                                    </button>
                                    <Card.Img
                                        variant="top"
                                        src={film.imageUrl ?
                                            `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                                            '/images/placeholder.png'}
                                        alt={film.titleName}
                                        style={{height: "350px", objectFit: "cover"}}
                                    />
                                    <Card.Body>
                                        <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                        <Card.Text className="text-muted mb-1">
                                            <ReadMore text={
                                                `${film.releaseYear} • ${film.genres ?
                                                    film.genres.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}`
                                            } maxLength={50}/>

                                        </Card.Text>
                                        <Card.Text>
                                            ⭐ <strong>{film.rating}</strong>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        ))}

                        <div className="d-flex justify-content-center mt-4">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(currentPage - 1)}
                                        >
                                            &laquo;
                                        </button>
                                    </li>

                                    {Array.from({length: Math.ceil(filteredFilms.length / filmsPerPage)})
                                        .map((_, index) => index + 1)
                                        .filter(
                                            (page) =>
                                                page === 1 ||
                                                page === Math.ceil(filteredFilms.length / filmsPerPage) ||
                                                (page >= currentPage - 2 && page <= currentPage + 2)
                                        )
                                        .map((page, i, arr) => {
                                            const prevPage = arr[i - 1];
                                            if (prevPage && page - prevPage > 1) {
                                                return (
                                                    <React.Fragment key={page}>
                                                        <li className="page-item disabled">
                                                            <span className="page-link">...</span>
                                                        </li>
                                                        <li
                                                            className={`page-item ${currentPage === page ? "active" : ""}`}
                                                        >
                                                            <button onClick={() => paginate(page)}
                                                                    className="page-link">
                                                                {page}
                                                            </button>
                                                        </li>
                                                    </React.Fragment>
                                                );
                                            }

                                            return (
                                                <li
                                                    key={page}
                                                    className={`page-item ${currentPage === page ? "active" : ""}`}
                                                >
                                                    <button onClick={() => paginate(page)} className="page-link">
                                                        {page}
                                                    </button>
                                                </li>
                                            );
                                        })}

                                    <li
                                        className={`page-item ${
                                            currentPage === Math.ceil(films.length / filmsPerPage)
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => paginate(currentPage + 1)}
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {filteredFilms.length === 0 && (
                            <div className="col-12">
                                <div className="alert alert-warning text-center">Unfortunately no films were found 😢
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
}
