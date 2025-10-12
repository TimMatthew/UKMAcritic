import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/AxiosConfig";

/*
!to_change add validation to fields
 */


export default function UpdateUser() {
    const [user, setUser] = useState({
        name: "",
        login: "",
        password: ""
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, [id]);


    const loadUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            const data = response.data;
            console.log(data);
            setUser({
                name: data.userName,
                login: data.login,
                password: data.password
            });

        } catch (err) {
            console.error("Error loading user:", err);
        }
    };

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}`, user);
            alert("User updated successfully!");
            navigate("/users");
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Failed to update user");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Update User</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="userName" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="userName"
                                value={user.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="login" className="form-label">
                                Login
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="login"
                                value={user.login}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={user.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success">
                            Update
                        </button>
                        <Link className="btn btn-secondary mx-2" to="/users">
                            Cancel
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}
