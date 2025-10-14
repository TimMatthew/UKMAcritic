import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './LoginPage.css';
import {Link} from "react-router-dom";

export default function RegisterPage({ onRegister }) {
    const [name, setName] = useState("");
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validate = () => {
        if (!name) return "Enter your name";
        if (!email) return "Enter your email";
        if (!login) return "Create your login";
        const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!re.test(email)) return "Wrong email format";
        if (!password) return "Enter your password";
        if (password.length < 6) return "Password must be at least 6 characters";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            // here will be logic for registration
            if (onRegister) onRegister({ name, email });
        } catch (err) {
            console.error(err);
            setError("Registration failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container py-4">
            <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm">
                        <div className="row g-0">
                            <div className="col-12 col-md-6">
                                <div className="card-body p-4">
                                    <h5 className="card-title mb-3 title-one">Registration</h5>

                                    {error && (
                                        <div className="alert alert-danger py-2" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                id="name"
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Your name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Login</label>
                                            <input
                                                id="login"
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setLogin(e.target.value)}
                                                placeholder="Your login"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="form-control"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="input-group">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword((s) => !s)}
                                                >
                                                    {showPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Confirm your
                                                password</label>
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button className="btn btn-success login-button" type="submit"
                                                    disabled={loading}>
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status"
                                                          aria-hidden="true"></span>
                                                ) : (
                                                    "Register"
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <small>
                                                Already have an account? <Link to="/login">Log in</Link>
                                            </small>
                                        </div>
                                    </form>
                                </div>

                            </div>
                            <div
                                className="сol-12 col-md-6 d-none d-md-flex login-bg align-items-center justify-content-center"
                                style={{
                                    backgroundImage: "url('/images/register_image.jpg')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    minHeight: "100%",
                                }}
                            >
                            </div>


                        </div>
                    </div>

                    <div className="text-center mt-3 small text-muted">
                        © {new Date().getFullYear()} UkmaCritic
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
