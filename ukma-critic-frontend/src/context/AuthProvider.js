import { createContext, useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import { useCookies } from "react-cookie";

const AuthContext  = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("site") || "");
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["jwt"]);

    const loginAction = async (data) => {
        try {

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login: data.username, password: data.password })
            });
            const res = await response.json();
            if (res.token) {
                setToken(res.token);
                setCookie("jwt", res.token, { path: "/", httpOnly: false });
                localStorage.setItem("site", res.token);
                const response_profile = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                const userData = await response_profile.json();
                if (userData.state) {
                    navigate("/admin-page");
                } else {
                    navigate("/user-page");
                }
                return;
            }
            throw new Error(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    const logOut = () => {
        localStorage.removeItem("site");
        setToken(null);
        navigate("/login");
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login: loginAction, logout: logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

