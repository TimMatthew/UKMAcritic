import React, { useEffect, useState } from "react";
import api from "../../api/AxiosConfig";

export default function AllReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [films, setFilms] = useState([]);
    const [users, setUsers] = useState([]);

    const [userFilter, setUserFilter] = useState(null);
    const [filmFilter, setFilmFilter] = useState(null);

    useEffect(() => {
        loadReviews();
        loadFilms();
        loadUsers();
    }, []);

    const filmsMap = new Map(films.map((m) => [m.id, m.titleName]));
    const usersMap = new Map(users.map((m) => [m.id, m.login]));

    const loadReviews = async () => {
        try {
            const response = await api.get(`/comments`);
            setReviews(response.data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        }
    };

    const loadFilms = async () => {
        try {
            const response = await api.get(`/titles`);
            setFilms(response.data);
        } catch (err) {
            console.error("Failed to load film", err);
        }
    };

    const loadUsers = async () => {
        try {
            const response = await api.get(`/users`);
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to load users", err);
        }
    };

    const displayedReviews = reviews.filter(
        (r) =>
            (!userFilter || r.userId === userFilter) &&
            (!filmFilter || r.titleId === filmFilter)
    );

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-semibold" style={{ color: "#fe9542" }}>
                Reviews management
            </h2>

            {userFilter && (
                <div className="mb-3">
                  <span className="badge me-2" style={{ backgroundColor: "#fe9542" }}>
                    User: {usersMap.get(userFilter)}
                      <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          aria-label="Close"
                          onClick={() => setUserFilter(null)}
                      ></button>
                  </span>
                </div>
            )}

            {filmFilter && (
                <div className="mb-3">
                  <span className="badge me-2" style={{ backgroundColor: "#92a377" }}>
                    Film: {filmsMap.get(filmFilter)}
                      <button
                          type="button"
                          className="btn-close btn-close-white btn-sm ms-2"
                          aria-label="Close"
                          onClick={() => setFilmFilter(null)}
                      ></button>
                  </span>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr style={{ textAlign: "left" }}>
                            <th scope="col">№</th>
                            <th scope="col">User</th>
                            <th scope="col">Title</th>
                            <th scope="col">Review</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedReviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-3">
                                    No reviews found
                                </td>
                            </tr>
                        ) : (
                            displayedReviews.map((review, index) => (
                                <tr key={review.id} style={{ textAlign: "left" }}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="fw-bold">{usersMap.get(review.userId)}</div>
                                    </td>
                                    <td>
                                        <div className="fw-bold">{filmsMap.get(review.titleId)}</div>
                                    </td>
                                    <td>{review.info}</td>
                                    <td className="text-left">
                                        <button
                                            className="btn btn-outline-primary btn-sm mx-1"
                                            onClick={() => setUserFilter(review.userId)}
                                        >
                                            <i className="bi bi-eye me-1"></i> All by this user
                                        </button>

                                        <button className="btn btn-outline-secondary btn-sm mx-1"
                                                onClick={() => setFilmFilter(review.titleId)}>
                                            <i className="bi bi-eye me-1"></i> All to this film
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
