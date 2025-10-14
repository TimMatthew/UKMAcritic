import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/AxiosConfig";

export default function ViewFilmsList() {
    const [films, setFilms] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
        } catch (err) {
            console.error(err);
            showMessage("Failed to load films", "danger");
        }
    };

    const deleteFilm = async (id, title) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
        if (!confirmed) return;

        try {
            await api.delete(`/films/${id}`);
            await loadFilms();
            showMessage(`"${title}" was deleted successfully`, "success");
        } catch (err) {
            console.error(err);
            showMessage(`Failed to delete "${title}"`, "danger");
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary mb-0">
                    <i className="bi bi-film me-2"></i> Films List
                </h2>
                <Link to="/films/add" className="btn btn-success">
                    <i className="bi bi-plus-lg me-1"></i> Add Film
                </Link>
            </div>

            {message && (
                <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                    {message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                    ></button>
                </div>
            )}

            <div className="card shadow border-0">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Genre</th>
                            <th scope="col">Year</th>
                            <th scope="col">Rating</th>
                            <th scope="col" className="text-center">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {films.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted py-4">
                                    No films found
                                </td>
                            </tr>
                        ) : (
                            films.map((film, index) => (
                                <tr key={film.titleId}>
                                    <td>{index + 1}</td>
                                    <td className="fw-semibold">{film.titleName}</td>
                                    <td>{film.genres.join(", ") || "—"}</td>
                                    <td>{film.releaseYear}</td>
                                    <td>
                                          <span className="badge bg-info text-dark">
                                            {film.rating}/10
                                          </span>
                                    </td>
                                    <td className="text-center">
                                        {/*  VIEW ADD LIKE FILM ADD PAGE  */}
                                        <Link
                                            to={`/films/view/${film.id}`}
                                            className="btn btn-outline-primary btn-sm mx-1"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Link>
                                        <Link
                                            to={`/films/edit/${film.id}`}
                                            className="btn btn-outline-secondary btn-sm mx-1"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <button
                                            className="btn btn-outline-danger btn-sm mx-1"
                                            onClick={() => deleteFilm(film.id, film.title)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
