import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Spinner, Card } from "react-bootstrap";
import api from "../../api/AxiosConfig";
import {Link} from "react-router-dom";
import ReadMore from "../../films/ReadMore";

export default function FilmsPageManager() {
    const [films, setFilms] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const filmsPerPage = 12;

    const [search, setSearch] = useState("");
    const [searchField, setSearchField] = useState("title");

    useEffect(() => {
        loadFilms();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
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

    const indexOfLastFilm = currentPage * filmsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
    const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleOpenFilm = (film) => setSelectedFilm(film);
    const handleClose = () => setSelectedFilm(null);

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">Films management page</h2>

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
                <div className="row">
                    {currentFilms.map((film) => (
                        <div key={film.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                            <Card
                                className="h-100 shadow-sm film-card"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleOpenFilm(film)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={film.imageUrl ?
                                        `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                                        '/images/placeholder.png'}
                                    alt={film.titleName}
                                    style={{ height: "350px", objectFit: "cover" }}
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

                                {Array.from({ length: Math.ceil(filteredFilms.length / filmsPerPage) })
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
                                                        <button onClick={() => paginate(page)} className="page-link">
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
                                        src={selectedFilm.imageUrl ?
                                            `https://image.tmdb.org/t/p/w500${selectedFilm.imageUrl}` :
                                            '/images/placeholder.png'}
                                        alt={selectedFilm.titleName}
                                        className="img-fluid rounded shadow-sm"
                                    />
                                </div>
                                <div className="col-md-7">
                                    <h5 className="mt-3 mt-md-0">Information</h5>
                                    <p><strong>Year:</strong> {selectedFilm.releaseYear}</p>
                                    <p><strong>Genres:</strong> {selectedFilm.genres ?
                                        selectedFilm.genres.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}</p>
                                    <p><strong>Actors:</strong> {selectedFilm.actors ?
                                        selectedFilm.actors.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}</p>
                                    <p><strong>Directors:</strong> {selectedFilm.director ?
                                        selectedFilm.director.join(', ').replace(/([a-z])([A-Z])/g, "$1 $2") : '-'}</p>
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
