import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Client.css";
import { Link } from "react-router-dom";
import api from "../../api/AxiosConfig";

export default function HomePageClient() {
    const [films, setFilms] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
        } catch (err) {
            console.error("Failed to load films", err);
        }
    };

    const filteredFilms = films.filter((film) =>
        film.titleName.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFavorite = (filmId) => {
        // !to_change here add "add to favourite" logic from database
        if (favorites.includes(filmId)) {
            setFavorites(favorites.filter((id) => id !== filmId));
        } else {
            setFavorites([...favorites, filmId]);
        }
    };

    return (
        <div className="container py-4">
            <div className="search-wrapper mb-4">
                <i className="bi bi-search search-icon"></i>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search films..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>


            <h2 className="mt-5 mb-4">Based on the film you liked</h2>
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-secondary text-center">
                        Not ready yet 😢
                    </div>
                </div>
            </div>

            <h2 className="mt-5 mb-4">Other people also like</h2>
            <div className="row">
                {filteredFilms.map((film) => (
                    <div key={film.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                        <div className="card h-100 shadow-sm position-relative">
                            <button
                                className={`btn btn-sm position-absolute top-0 end-0 m-2 ${
                                    favorites.includes(film.id) ? "btn-danger" : "btn-outline-danger"
                                }`}
                                onClick={() => toggleFavorite(film.id)}
                                title={favorites.includes(film.id) ? "Delete from favorites" : "Add to favourites"}
                            >
                                ❤️
                            </button>

                            <Link to={`/films/${film.id}`} className="text-decoration-none text-dark">
                                <img
                                    src={film.tmdb_image_url ?
                                        `https://image.tmdb.org/t/p/w500${film.tmdb_image_url}` :
                                'images/placeholder.png'}
                                    className="card-img-top"
                                    alt={film.titleName}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{film.titleName}</h5>
                                    <p className="card-text text-truncate">{film.overview}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">{film.releaseYear}</small>
                                        <small className="text-warning">⭐ {film.rating}</small>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}

                {filteredFilms.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-warning text-center">Unfortunately no films were found 😢</div>
                    </div>
                )}
            </div>


        </div>
    );
}
