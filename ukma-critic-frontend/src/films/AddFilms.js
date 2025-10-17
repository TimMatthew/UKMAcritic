import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal } from "bootstrap";
import "./AddFilms.css";
import ReadMore from "./ReadMore";

export default function AddFilms() {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        getFilms(page);
    }, [page]);

    const getFilms = async (pageNumber) => {
        setLoading(true);
        try {
            const options = {
                method: "GET",
                url: `${process.env.REACT_APP_POPULAR_API_CALL}?page=${pageNumber}`,
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                },
            };

            const res = await axios.request(options);
            setFilms(res.data.results);
            setTotalPages(res.data.total_pages);
        } catch (err) {
            console.error("Error while getting films data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToDatabase = async (film) => {
        try {
            const token = localStorage.getItem("site");

            console.log(film);

            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/titles`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        titleName: film.titleName,
                        genres: film.genres,
                        releaseYear: film.releaseYear,
                        rating: film.rating,
                        director: film.director,
                        actors: film.actors,
                        imageUrl: film.posterPath,
                        // tmdb: film.idTmdb,
                        overview: film.overview,
                        keywords: null
                        // regions: film.regions
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to create film");
            }

            showMessage("Film added to database successfully", "success");
            setTimeout(() => {
                const modal = new Modal(
                    document.getElementById("filmModal")
                );
                modal.hide();
            }, 1500);
        } catch (err) {
            console.error(err);
            showMessage("Failed to update film", "danger");
        }
    }

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleOpenFilm = async (film) => {
        try {
            const creditsRes = await axios.get(
                `${process.env.REACT_APP_MOVIE_API_CALL}/${film.id}/credits`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                    },
                }
            );

            const credits = creditsRes.data;

            const detailsRes = await axios.get(
                `${process.env.REACT_APP_MOVIE_API_CALL}/${film.id}`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                    },
                }
            );
            const details = detailsRes.data;

            const director = credits.crew
                .filter((c) => c.job === "Director")
                .map((d) => d.name);

            const actors = credits.cast.map((a) => a.name);
            const genres = details.genres.map((g) => g.name);

            const filmData = {
                director,
                genres,
                actors,
                // regions: details.origin_country,
                titleName: film.title,
                overview: film.overview,
                releaseYear: film.release_date
                    ? parseInt(film.release_date.split("-")[0])
                    : null,
                rating: Math.round(film.vote_average),
                // idTmdb: film.id,
                posterPath: film.poster_path,
                keywords: film.keywords
            };

            setSelectedFilm(filmData);

            const modal = new Modal(
                document.getElementById("filmModal")
            );
            modal.show();
        } catch (error) {
            console.error("Error while fetching film data:", error);
        }
    };

    const nextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="text-center mb-5 fw-bold">Popular films</h1>

            <div className="row g-4">
                {films.map((film) => (
                    <div key={film.id} className="col-6 col-md-4 col-lg-3">
                        <div className="film-card card h-100 border-0 shadow-sm">
                            <div className="position-relative overflow-hidden">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                                    className="card-img-top"
                                    alt={film.title}
                                />
                                <button
                                    className="add-btn btn btn-success position-absolute top-50 start-50 translate-middle"
                                    onClick={() => handleOpenFilm(film)}
                                >
                                    Add to database
                                </button>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title text-truncate">{film.title}</h5>
                                <p className="card-text text-muted mb-0">
                                    ⭐ {film.vote_average.toFixed(1)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
                <button
                    className="btn btn-outline-primary"
                    disabled={page === 1}
                    onClick={prevPage}
                >
                    ⬅ Previous page
                </button>

                <span className="fw-semibold">
          Сторінка {page} / {totalPages}
        </span>

                <button
                    className="btn btn-outline-primary"
                    disabled={page === totalPages}
                    onClick={nextPage}
                >
                    Next page ➡
                </button>
            </div>

            <div
                className="modal fade"
                id="filmModal"
                tabIndex="-1"
                aria-labelledby="filmModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="filmModalLabel">
                                About the selected film
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {message && (
                                <div
                                    className={`alert alert-${messageType} alert-dismissible fade show`}
                                    role="alert"
                                >
                                    {message}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMessage("")}
                                    ></button>
                                </div>
                            )}
                            {selectedFilm ? (
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-4 text-center mb-3 mb-md-0">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500/${selectedFilm.posterPath}`}
                                                alt={selectedFilm.titleName}
                                                className="img-fluid rounded shadow-sm"
                                            />
                                        </div>

                                        <div className="col-md-8" style={{textAlign: 'left'}}>
                                            <h4 className="fw-bold mb-3">{selectedFilm.titleName}</h4>
                                            <p>
                                                <strong>Directors:</strong>{" "}
                                                {selectedFilm.director.join(", ") || "—"}
                                            </p>
                                            <div className="mt-3">
                                                <strong>Actors:</strong>
                                                <br/>
                                                {selectedFilm.actors.join(", ") ? (
                                                    <ReadMore text={selectedFilm.actors.join(", ")} maxLength={250}/>
                                                ) : (
                                                    "—"
                                                )}
                                            </div>
                                            <p>
                                                <strong>Genres:</strong>{" "}
                                                {selectedFilm.genres.join(", ") || "—"}
                                            </p>
                                            {/*<p>*/}
                                            {/*    <strong>Regions:</strong>{" "}*/}
                                            {/*    {selectedFilm.regions.join(", ") || "—"}*/}
                                            {/*</p>*/}
                                            <p>
                                                <strong>Release year:</strong> {selectedFilm.releaseYear}
                                            </p>
                                            <p>
                                                <strong>Rating:</strong> {selectedFilm.rating}
                                            </p>
                                            <p>
                                                <strong>ID TMDB:</strong> {selectedFilm.idTmdb}
                                            </p>
                                            <div className="mt-3">
                                                <strong>Description:</strong>
                                                <br/>
                                                {selectedFilm.overview ? (
                                                    <ReadMore text={selectedFilm.overview} maxLength={250}/>
                                                ) : (
                                                    "—"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading data...</p>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={() =>handleAddToDatabase(selectedFilm)}>
                                Add to database
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
