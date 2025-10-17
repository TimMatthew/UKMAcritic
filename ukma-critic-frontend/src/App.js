import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./layout/Navbar";
import UsersPage from "./pages/managers/UsersPage";
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import ViewUser from "./users/ViewUser";
import UpdateUser from "./users/UpdateUser";
import AddFilms from "./films/AddFilms";
import ViewFilmsList from "./films/ViewFilmsList";
import UpdateFilm from "./films/UpdateFilm";
import LoginPage from "./pages/LoginPage";
import {AuthProvider} from "./context/AuthProvider";
import ProtectedRoute from "./context/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import {CookiesProvider} from "react-cookie";
import HomePageManager from "./pages/managers/HomePageManager";
import HomePageClient from "./pages/clients/HomePageClient";
import HomePage from "./pages/HomePage";
import FilmsPageManager from "./pages/managers/FilmsPageManager";
import FilmInfoPageClient from "./pages/clients/FilmInfoPageClient";
import ModerateUsersCommentsPage from "./pages/managers/ModerateUsersCommentsPage";
import AllReviewsPage from "./pages/managers/AllReviewsPage";
import ProfilePageClient from "./pages/clients/ProfilePageClient";
import FavouriteFilmsPage from "./pages/clients/FavouriteFilmsPage";
import HomeRedirect from "./context/HomeRedirect";


function App() {
    return (
        <Router>
            <CookiesProvider>
        <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/" element={<HomeRedirect />} />

                    {/* manager */}

                    <Route
                        path="/admin-page"
                        element={
                            <ProtectedRoute>
                                <HomePageManager />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-page/users"
                        element={
                            <ProtectedRoute>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-page/users/view_user/:id"
                        element={
                            <ProtectedRoute>
                                <ViewUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-page/users/update_user/:id"
                        element={
                            <ProtectedRoute>
                                <UpdateUser />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-page/users/comments/:id"
                        element={
                            <ProtectedRoute>
                                <ModerateUsersCommentsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-page/comments/"
                        element={
                            <ProtectedRoute>
                                <AllReviewsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-page/films"
                        element={
                            <ProtectedRoute>
                                <FilmsPageManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin-page/films/edit/:id"
                        element={
                            <ProtectedRoute>
                                <UpdateFilm />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin-page/films/add"
                        element={
                            <ProtectedRoute>
                                <AddFilms />
                            </ProtectedRoute>
                        }
                    />




                    {/*<Route*/}
                    {/*    path="/films/all-films"*/}
                    {/*    element={*/}
                    {/*        <ProtectedRoute>*/}
                    {/*            <ViewFilmsList />*/}
                    {/*        </ProtectedRoute>*/}
                    {/*    }*/}
                    {/*/>*/}


                    {/* client */}

                    <Route
                        path="/user-page"
                        element={
                            <ProtectedRoute>
                                <HomePageClient />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user-page/films/info/:id"
                        element={
                            <ProtectedRoute>
                                <FilmInfoPageClient />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user-page/profile/"
                        element={
                            <ProtectedRoute>
                                <ProfilePageClient />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user-page/films/favourite/"
                        element={
                            <ProtectedRoute>
                                <FavouriteFilmsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/*<Route*/}
                    {/*    path="/"*/}
                    {/*    element={*/}
                    {/*        <ProtectedRoute>*/}
                    {/*            <HomePage />*/}
                    {/*        </ProtectedRoute>*/}
                    {/*    }*/}
                    {/*/>*/}
                </Routes>
        </AuthProvider>
            </CookiesProvider>
            </Router>
    );
}

export default App;
