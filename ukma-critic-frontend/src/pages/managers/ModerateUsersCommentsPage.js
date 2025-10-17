import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import api from "../../api/AxiosConfig";

export default function ModerateUsersCommentsPage () {
    const { id } = useParams();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [reviews, setReviews] = useState([]);
    const [films, setFilms] = useState([]);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    useEffect(() => {
        loadReviews();
        loadFilms();
    }, [id]);

    const filmsMap = new Map(films.map(m => [m.id, m.titleName]));

    const loadReviews = async () => {
        try {
            const response = await api.get(`/comments/user/${id}`);
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

    const deleteReview = async (userId, reviewId) => {
        // !to_change add deleting of comment
        // @DeleteMapping("remove/{comment}/{user}")
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-semibold" style={{color: '#fe9542'}}>User's reviews management</h2>
            <p className="mb-4 fw-semibold" style={{color: '#92a377'}}>{id}</p>

            {message && (
                <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr style={{textAlign: 'left'}}>
                            <th scope="col">№</th>
                            <th scope="col">Title</th>
                            <th scope="col">Review</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-3">
                                    No reviews found
                                </td>
                            </tr>
                        ) : (
                            reviews.map((review, index) => (
                                <tr key={review.id} style={{textAlign: 'left'}}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="fw-bold">{filmsMap.get(review.titleId)}</div>
                                    </td>
                                    <td>{review.info}</td>
                                    <td className="text-left" >
                                        {/*<button className="btn btn-outline-primary btn-sm mx-1"*/}
                                        {/*onClick={() => loadNames(review.titleId, review.userId)}>*/}
                                        {/*    <i className="bi bi-eye me-1"></i> Load names*/}
                                        {/*</button>*/}
                                        <button
                                            className="btn btn-outline-danger btn-sm mx-1"
                                            onClick={() => deleteReview(review.userId, review.id)}
                                        >
                                            <i className="bi bi-trash me-1"></i> Delete
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