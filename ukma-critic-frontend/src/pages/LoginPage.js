import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css"
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthProvider";


export default function LoginPage() {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const login = useAuth();
    const auth = useAuth();
    // const navigate = useNavigate();

    const validate = () => {
        if (!input.username) return "Enter valid login";
        // const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        // if (!re.test(login)) return "Wrong email format";
        if (input.username.length < 3) return "Login must be at least 3 characters";
        if (!input.password) return "Enter your password";
        if (input.password.length < 3) return "Password must be at least 6 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const val_res = validate();
        if (val_res) {
            setError(val_res);
            return;
        }

        setLoading(true);
        try {
            auth.login(input);
        } catch (err) {
            console.error(err);
            setError("Authorization failed. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="row g-0">
                            <div
                                className="col-md-5 d-none d-md-flex align-items-center justify-content-center bg-light"
                                style={{
                                    backgroundImage: "url('/images/login_image.jpg')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    minHeight: "100%",
                                }}
                            >
                            </div>
                            <div className="col-md-7">
                                <div className="card-body p-4">
                                    <h5 className="card-title mb-3 title-one">Log in</h5>

                                    {error && (
                                        <div className="alert alert-danger py-2" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3" style={{textAlign: 'left'}}>
                                            <label htmlFor="login" className="form-label">
                                                Login
                                            </label>
                                            <input
                                                id="login"
                                                type="login"
                                                className="form-control"
                                                value={input.username}
                                                onChange={(e) =>
                                                    setInput({ ...input, username: e.target.value })}
                                                placeholder="name"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3" style={{textAlign: 'left'}}>
                                            <label htmlFor="password" className="form-label">
                                                Password
                                            </label>

                                            <div className="input-group">
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    className="form-control"
                                                    value={input.password}
                                                    onChange={(e) =>
                                                        setInput({ ...input, password: e.target.value })}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowPassword((s) => !s)}
                                                    aria-pressed={showPassword}
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="form-check">
                                                <input
                                                    id="remember"
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={remember}
                                                    onChange={(e) => setRemember(e.target.checked)}
                                                />
                                                <label htmlFor="remember" className="form-check-label">
                                                    Remember me
                                                </label>
                                            </div>

                                            <a href="#" className="small">
                                                Forgot your password?
                                            </a>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button className="btn btn-primary login-button" type="submit" disabled={loading}>
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm" role="status"
                                                          aria-hidden="true"></span>
                                                ) : (
                                                    "Log in"
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center mb-3">
                                            <small className="text-muted">Or log in via</small>
                                        </div>

                                        <div className="d-flex gap-2 mb-3">
                                            <button type="button" className="btn btn-outline-secondary w-100" disabled>
                                                Google
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary w-100" disabled>
                                                Facebook
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <small>
                                                Don't have an account? <Link to="/register">Register</Link>
                                            </small>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-3 small text-muted">
                        © {new Date().getFullYear()} UKMACritic
                    </div>
                </div>
            </div>
        </div>
    );
}
