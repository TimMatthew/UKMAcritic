import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";

export default function FavouriteFilmsPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`/favs/${user.id}`, {
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
    }, []);

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

            {favorites.length === 0 ? (
                <div className="text-center mt-5">
                    <h5 className="text-muted">You haven’t added any favourite films yet.</h5>
                    <p className="text-secondary">Explore films and click the ❤️ icon to save them!</p>
                </div>
            ) : (
                <div className="row g-4">
                    {favorites.map((film) => (
                        <div className="col-sm-6 col-md-4 col-lg-3" key={film.id}>
                            <Card
                                className="shadow-sm h-100 position-relative film-card"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/user-page/films/info/${film.id}`)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={film.posterUrl || "/default-poster.jpg"}
                                    alt={film.title}
                                    className="film-poster"
                                />
                                <Card.Body>
                                    <Card.Title className="fw-semibold text-center">{film.title}</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
