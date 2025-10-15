import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

export default function Navbar() {
    const { role, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{backgroundColor:'#190b00', color: '#f1e7e0'}}>
            {role === "manager" && (
                <Link className="navbar-brand fw-bold" to="/admin-page">
                    🎥 UkmaCritic
                </Link>
            )}
            {role === "client" && (
                <Link className="navbar-brand fw-bold" to="/user-page">
                    🎥 UkmaCritic
                </Link>
            )}


            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                    <li className="nav-item">
                        <Link className="nav-link" to="/films">Films</Link>
                    </li>

                    {role === "manager" && (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/users">Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/comments">Reviews</Link>
                            </li>
                        </>
                    )}

                    {role === "client" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/profile">My profile</Link>
                        </li>
                    )}
                </ul>

                <button className="btn btn-outline-light" onClick={logout}>
                    Log out
                </button>
            </div>
        </nav>
    );
}
