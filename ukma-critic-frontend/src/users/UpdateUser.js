import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/AxiosConfig";

export default function UpdateUser() {
    const [user, setUser] = useState({
        name: "",
        login: "",
        state: true
    });

    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const data = response.data;
            setUser({
                name: data.userName,
                login: data.login,
                state: data.state
            });
        } catch (err) {
            console.error("Error loading user:", err);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!user.name.trim()) {
            newErrors.name = "Name is required";
        } else if (user.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!user.login.trim()) {
            newErrors.login = "Login is required";
        } else if (!/^[a-zA-Z0-9._-]+$/.test(user.login)) {
            newErrors.login = "Login can contain only letters, numbers, dots, underscores, and dashes";
        } else if (user.login.length < 4) {
            newErrors.login = "Login must be at least 4 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            await api.put(`/users/${id}`, user);
            alert("User updated successfully!");
            navigate("/admin-page/users");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user");
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow border-0 rounded-4">
                        <div className="card-header bg-warning text-white rounded-top-4">
                            <h4 className="mb-0 text-center">
                                <i className="bi bi-pencil-square me-2"></i>Update User
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

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="userName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                        name="name"
                                        value={user.name}
                                        onChange={handleInputChange}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="login" className="form-label">Login</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.login ? "is-invalid" : ""}`}
                                        name="login"
                                        value={user.login}
                                        onChange={handleInputChange}
                                    />
                                    {errors.login && <div className="invalid-feedback">{errors.login}</div>}
                                </div>

                                <div className="mb-3">
                                    <div
                                        className="d-flex align-items-center gap-3 justify-content-center"
                                    >
                                        <span>Client</span>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                name="state"
                                                checked={user.state}
                                                onChange={handleInputChange}
                                                type="checkbox"
                                                id="flexSwitchCheckDefault"
                                            />
                                        </div>
                                        <span>Manager</span>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <Link to="/admin-page/users" className="btn btn-outline-secondary">
                                        <i className="bi bi-arrow-left-circle me-1"></i> Back to Users
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
