import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/AxiosConfig";
import TagInput from "./TagInput";
import StarRating from "./StarRating";

export default function UpdateFilm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [film, setFilm] = useState({});

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadFilm();
    }, [id]);

    const loadFilm = async () => {
        try {
            const response = await api.get(`/titles/${id}`);
            const filmData = response.data;
            setFilm({
                title: filmData.titleName,
                genres: filmData.genres,
                year: filmData.releaseYear,
                rating: filmData.rating,
                director: filmData.director,
                actors: filmData.actors,
                regions: filmData.regions,
                tmdb_image_url: filmData.imageUrl,
                // tmdb: filmData.tmdb,
                overview: filmData.overview
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            showMessage("Failed to load film", "danger");
            setLoading(false);
        }
    };

    const onInputChange = (e) => {
        setFilm({ ...film, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try {
            const token = localStorage.getItem("site");

            console.log(film.director)

            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/titles/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        titleName: film.title,
                        genres: film.genres,
                        releaseYear: film.year,
                        rating: film.rating,
                        director: film.director,
                        actors: film.actors,
                        imageUrl: film.tmdb_image_url,
                        // tmdb: film.tmdb,
                        overview: film.overview,
                        regions: film.regions
                    }),
                }
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Failed to update film");
            }
            showMessage("Film updated successfully", "success");
            setTimeout(() => navigate("/admin-page/films"), 1500);
        } catch (err) {
            console.error(err);
            showMessage("Failed to update film", "danger");
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!film.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!film.overview.trim()) {
            newErrors.overview = "Overview is required";
        }

        if (!film.tmdb_image_url.trim()) {
            newErrors.tmdb_image_url = "Poster path is required";
        }

        // if (!film.tmdb.trim()) {
        //     newErrors.tmdb = "TMDB id is required";
        // } else if (!/^[0-9]+$/.test(film.tmdb)) {
        //     newErrors.tmdb = "TMDB id should include only numbers";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading film...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-header bg-warning text-white rounded-top-4">
                            <h4 className="mb-0 text-center">
                                <i className="bi bi-pencil-square me-2"></i>Update Film
                            </h4>
                        </div>

                        <div className="card-body">
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

                            <form onSubmit={onSubmit}>
                                {/*<div className="mb-3">*/}
                                {/*    <label htmlFor="tmdb" className="form-label fw-semibold">*/}
                                {/*        TMDB id*/}
                                {/*    </label>*/}
                                {/*    <input*/}
                                {/*        type="text"*/}
                                {/*        className={`form-control ${errors.tmdb ? "is-invalid" : ""}`}*/}
                                {/*        id="tmdb"*/}
                                {/*        name="tmdb"*/}
                                {/*        value={film.tmdb}*/}
                                {/*        onChange={onInputChange}*/}
                                {/*        required*/}
                                {/*    />*/}
                                {/*    {errors.tmdb && <div className="invalid-feedback">{errors.tmdb}</div>}*/}
                                {/*</div>*/}

                                <div className="mb-3">
                                    <label htmlFor="tmdb_image_url" className="form-label fw-semibold">
                                        TMDB poster url
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.tmdb_image_url ? "is-invalid" : ""}`}
                                        id="tmdb_image_url"
                                        name="tmdb_image_url"
                                        value={film.tmdb_image_url}
                                        onChange={onInputChange}
                                        required
                                    />
                                    {errors.tmdb_image_url && <div className="invalid-feedback">{errors.tmdb_image_url}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                        id="title"
                                        name="title"
                                        value={film.title}
                                        onChange={onInputChange}
                                        required
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                <div className="mb-3">
                                    <TagInput
                                        label="Genres"
                                        values={film.genres || []}
                                        onChange={(genres) => setFilm({...film, genres})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <TagInput
                                        label="Actors"
                                        values={film.actors || []}
                                        onChange={(actors) => setFilm({...film, actors})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <TagInput
                                        label="Directors"
                                        values={film.director || []}
                                        onChange={(director) => setFilm({...film, director})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <TagInput
                                        label="Regions"
                                        values={film.regions || []}
                                        onChange={(regions) => setFilm({...film, regions})}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="year" className="form-label fw-semibold">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="year"
                                        name="year"
                                        value={film.year}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Rating</label>
                                    <StarRating
                                        rating={film.rating || 0}
                                        onChange={(value) => setFilm({...film, rating: value})}
                                        max={10}
                                    />
                                    <small className="text-muted">{film.rating?.toFixed(1)} / 10</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="overview" className="form-label fw-semibold">
                                        Overview
                                    </label>
                                    <textarea
                                        // type="comment"
                                        className={`form-control ${errors.overview ? "is-invalid" : ""}`}
                                        id="overview"
                                        name="overview"
                                        value={film.overview}
                                        onChange={onInputChange}
                                        required
                                    />
                                    {errors.overview && <div className="invalid-feedback">{errors.overview}</div>}
                                </div>


                                <div className="d-flex justify-content-between">
                                    <Link to="/films" className="btn btn-outline-secondary">
                                        <i className="bi bi-arrow-left-circle me-1"></i> Back
                                    </Link>

                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-check-circle me-1"></i> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
