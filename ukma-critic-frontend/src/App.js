import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./layout/Navbar";
import UsersPage from "./pages/UsersPage";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ViewUser from "./users/ViewUser";
import UpdateUser from "./users/UpdateUser";
import FilmsPage from "./pages/FilmsPage";
import AddFilms from "./films/AddFilms";
import ViewFilmsList from "./films/ViewFilmsList";
import UpdateFilm from "./films/UpdateFilm";
import LoginPage from "./pages/LoginPage";
import {AuthProvider} from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/view_user/:id"
                        element={
                            <ProtectedRoute>
                                <ViewUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users/update_user/:id"
                        element={
                            <ProtectedRoute>
                                <UpdateUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/films"
                        element={
                            <ProtectedRoute>
                                <FilmsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/films/add"
                        element={
                            <ProtectedRoute>
                                <AddFilms />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/films/all-films"
                        element={
                            <ProtectedRoute>
                                <ViewFilmsList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/films/edit/:id"
                        element={
                            <ProtectedRoute>
                                <UpdateFilm />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
