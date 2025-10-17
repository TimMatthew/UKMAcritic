import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import api from "../../api/AxiosConfig";
import ReadMore from "../../films/ReadMore";

export default function FavouriteFilmsPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const [films, setFilms] = useState([]);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadFilms();
    }, []);

    const loadFilms = async () => {
        try {
            const response = await api.get("/titles");
            setFilms(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load films", err);
        }
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${user.userId}`, {
                    credentials: "include",
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    const favouriteFilms = films.filter(film =>
        favorites.some(fav => fav.titleId === film.id)
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4 fw-bold text-danger">❤️ Favourite Films</h2>

            {favouriteFilms.length === 0 ? (
                <div className="text-center mt-5">
                    <h5 className="text-muted">You haven’t added any favourite films yet.</h5>
                    <p className="text-secondary">
                        Explore films and click the ❤️ icon to save them!
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {favouriteFilms.map((film) => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={film.id}>
                            <Card
                                className="shadow-sm h-100 position-relative film-card"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/user-page/films/info/${film.id}`)}
                            >
                                <button
                                    className="btn btn-sm position-absolute top-0 end-0 m-2 btn-danger"
                                    title="Remove from favourites"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        try {
                                            const favRecord = favorites.find(fav => fav.titleId === film.id);
                                            if (!favRecord) return;

                                            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/favs/${favRecord.favId}`, {
                                                method: "DELETE",
                                                credentials: "include",
                                            });
                                            if (response.ok) {
                                                setFavorites(prev => prev.filter(fav => fav.titleId !== film.id));
                                            } else {
                                                console.error("Failed to delete favourite");
                                            }
                                        } catch (err) {
                                            console.error("Error deleting favourite:", err);
                                        }
                                    }}
                                >
                                    ❤️
                                </button>
                                <Card.Img
                                    variant="top"
                                    src={film.imageUrl ?
                                        `https://image.tmdb.org/t/p/w500${film.imageUrl}` :
                                        '/images/placeholder.png'}
                                    alt={film.titleName}
                                    className="film-poster"
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
                </div>
            )}
        </div>
    );
}
