import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/AxiosConfig";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id, name) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) {
            showMessage(`User ${name} was not deleted`, "warning");
            return;
        }

        try {
            await api.delete(`/users/${id}`);
            await loadUsers();
            showMessage(`User ${name} was deleted`, "success");
        } catch (err) {
            console.error("Failed to delete user:", err);
            showMessage(`Failed to delete user ${name}`, "danger");
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-primary fw-semibold">User Management</h2>

            {message && (
                <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage("")}></button>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                        <tr style={{textAlign: 'left'}}>
                            <th scope="col">№</th>
                            <th scope="col">Name</th>
                            <th scope="col">Login</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center text-muted py-3">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user.id} style={{textAlign: 'left'}}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="fw-bold">{user.name}</div>
                                        <small className="text-muted">{user.email}</small>
                                    </td>
                                    <td>{user.login}</td>
                                    <td>{user.state ? "Manager" : "Client"}</td>
                                    <td className="text-left" >
                                        <Link to={`/admin-page/users/view_user/${user.id}`}
                                              className="btn btn-outline-primary btn-sm mx-1">
                                            <i className="bi bi-eye me-1"></i> View
                                        </Link>

                                        <Link to={`/admin-page/users/update_user/${user.id}`}
                                              className="btn btn-outline-secondary btn-sm mx-1">
                                            <i className="bi bi-pencil me-1"></i> Update
                                        </Link>

                                        <button
                                            className="btn btn-outline-danger btn-sm mx-1"
                                            onClick={() => deleteUser(user.id, user.name)}
                                        >
                                            <i className="bi bi-trash me-1"></i> Delete
                                        </button>

                                        {!user.state && (
                                            <Link className="btn btn-outline-success btn-sm mx-1"
                                            to={`/admin-page/users/comments/${user.id}`}>
                                                <i className="bi bi-chat-dots me-1"></i> Comments
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/*<div className="text-end">*/}
            {/*    <Link to={`/users/update_user/$s}`} className="btn btn-success">*/}
            {/*        <i className="bi bi-plus-lg me-1"></i> Create new user*/}
            {/*    </Link>*/}
            {/*</div>*/}
        </div>
    );
}
