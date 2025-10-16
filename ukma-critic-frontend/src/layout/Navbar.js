import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
    const { role, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark px-3" style={{backgroundColor:'#190b00', color: '#f1e7e0'}}>
            {role === "" && (
                <Link className="navbar-brand fw-bold" to="/login">
                    🎥 UkmaCritic
                </Link>
            )}

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

                    {role === "manager" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/admin-page/films">Films</Link>
                        </li>
                    )}

                    {/*change url for users*/}
                    {role === "client" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/user-page/favourite-films">Favourite films</Link>
                        </li>
                    )}

                    {role === "manager" && (
                        <>
                        <li className="nav-item">
                                <Link className="nav-link" to="/admin-page/users">Users</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin-page/comments">Reviews</Link>
                            </li>
                        </>
                    )}

                    {role === "client" && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/user-page/profile">My profile</Link>
                        </li>
                    )}
                </ul>

                {role !== "" && (
                    <button className="btn btn-outline-light" onClick={logout}>
                        Log out
                    </button>
                )}

                {role === "" && (
                    <Link className="btn btn-outline-light" to='/login'>
                        Log in
                    </Link>
                )}
            </div>
        </nav>
    );
}
