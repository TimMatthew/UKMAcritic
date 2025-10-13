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
        state: true
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
            /*
            for example I have this object
            Object { userId: "some_id", userName: "some_name", login: "some_login", state: true/false }
            */
            setUser({
                name: data.userName,
                login: data.login,
                state: data.state
            });

        } catch (err) {
            console.error("Error loading user:", err);
        }
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
        // console.log(user);
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
        <div className="container" style={{display: 'flex', alignItems: 'center', width: '88%'}}>
            <div className="row" style={{display: 'flex', width: '100%'}}>
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
                                name="name"
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
                            <div className="d-flex align-items-center gap-3" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
