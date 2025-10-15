import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/AxiosConfig";

export default function ViewUser() {
    const [user, setUser] = useState({
        userName: "",
        login: "",
        state: false,
    });

    const { id } = useParams();

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-header bg-primary text-white text-center rounded-top-4">
                            <h4 className="mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                User Details
                            </h4>
                        </div>

                        <div className="card-footer text-center bg-light">
                            <Link to={`/users/update_user/${id}`} className="btn btn-sm btn-outline-success">
                                <i className="bi bi-arrow-left-circle me-1"></i> Change
                            </Link>
                        </div>

                        <div className="card-body">
                            <p className="text-muted mb-3">
                                <strong>User ID:</strong> {id}
                            </p>

                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Name:</strong> {user.userName}
                                </li>
                                <li className="list-group-item">
                                    <strong>Login:</strong> {user.login}
                                </li>
                                <li className="list-group-item">
                                    <strong>Role:</strong>{" "}
                                    <span
                                        className={`badge ${
                                            user.state ? "bg-success" : "bg-secondary"
                                        }`}
                                    >
                    {user.state ? "Manager" : "Client"}
                  </span>
                                </li>
                            </ul>
                        </div>

                        <div className="card-footer text-center bg-light">
                            <Link to="/users" className="btn btn-outline-primary">
                                <i className="bi bi-arrow-left-circle me-1"></i> Back to Users
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
