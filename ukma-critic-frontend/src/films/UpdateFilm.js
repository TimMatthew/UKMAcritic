import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/AxiosConfig";

export default function UpdateFilm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [film, setFilm] = useState({
        title: "",
        genre: "",
        year: "",
        rating: ""
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFilm();
    }, [id]);

    const loadFilm = async () => {
        try {
            const response = await api.get(`/films/${id}`);
            setFilm(response.data);
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
        try {
            await api.put(`/films/${id}`, film);
            showMessage("Film updated successfully", "success");
            setTimeout(() => navigate("/films"), 1500);
        } catch (err) {
            console.error(err);
            showMessage("Failed to update film", "danger");
        }
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
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-semibold">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={film.title}
                                        onChange={onInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="genre" className="form-label fw-semibold">
                                        Genre
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="genre"
                                        name="genre"
                                        value={film.genre}
                                        onChange={onInputChange}
                                        required
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
                                    <label htmlFor="rating" className="form-label fw-semibold">
                                        Rating
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="rating"
                                        name="rating"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={film.rating}
                                        onChange={onInputChange}
                                        required
                                    />
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
