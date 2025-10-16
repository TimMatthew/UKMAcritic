import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Spinner, Card } from "react-bootstrap";
import api from "../../api/AxiosConfig";
import {Link} from "react-router-dom";

export default function FilmsPageManager() {
    const [films, setFilms] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenFilm = (film) => setSelectedFilm(film);
    const handleClose = () => setSelectedFilm(null);

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">Films management page</h2>
            <div style={{display: 'flex', margin: '20px', justifyContent: 'center'}}>
                <Link type="button" to={`/admin-page/films/add`}
                      className="btn btn-primary"
                      style={{backgroundColor: 'white', color: 'blue', borderColor: 'blue'}}
                >Add new films</Link>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {!loading && !error && (
                <div className="row g-4">
                    {films.map((film) => (
                        <div key={film.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <Card
                                className="h-100 shadow-sm film-card"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleOpenFilm(film)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={`https://image.tmdb.org/t/p/w500${film.tmdb_image_url}`}
                                    alt={film.titleName}
                                    style={{ height: "350px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate">{film.titleName}</Card.Title>
                                    <Card.Text className="text-muted mb-1">
                                        {film.releaseYear} • {film.genres.join(', ') | '-'}
                                    </Card.Text>
                                    <Card.Text>
                                        ⭐ <strong>{film.rating}</strong>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={!!selectedFilm} onHide={handleClose} centered size="lg">
                {selectedFilm && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedFilm.titleName}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-5">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${selectedFilm.tmdb_image_url}`}
                                        alt={selectedFilm.titleName}
                                        className="img-fluid rounded shadow-sm"
                                    />
                                </div>
                                <div className="col-md-7">
                                    <h5 className="mt-3 mt-md-0">Information</h5>
                                    <p><strong>Year:</strong> {selectedFilm.releaseYear}</p>
                                    <p><strong>Genres:</strong> {selectedFilm.genres ? selectedFilm.genres.join(', ') : '-'}</p>
                                    <p><strong>Actors:</strong> {selectedFilm.actors ? selectedFilm.actors.join(', ') : '-'}</p>
                                    <p><strong>Directors:</strong> {selectedFilm.directors ? selectedFilm.directors.join(', ') : '-'}</p>
                                    <p><strong>Rating:</strong> ⭐ {selectedFilm.rating}</p>
                                    <p>{selectedFilm.overview}</p>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Link to={`/admin-page/films/edit/${selectedFilm.id}`}>
                                Edit film
                            </Link>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </div>
    );
}
