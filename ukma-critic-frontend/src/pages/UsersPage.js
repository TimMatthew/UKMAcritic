import React from "react";
import {useEffect, useState} from "react";
import api from "../api/AxiosConfig";
import {Link} from "react-router-dom";

/*
!to_change style + button styles
*/

export default function UsersPage () {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    // or, for example, 'danger'.

    useEffect(() => {
        loadUsers().then(r => {});
    }, []);

    const loadUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            console.log(response.data);
        }catch (err){
            console.log(err);
        }
    }

    const deleteUser = async (id, name) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (!confirmed) {
            setMessage(`User ${name} was not deleted`);
            setMessageType('warning');
            autoClearMessage();
            return;
        }

        try {
            await api.delete(`/users/${id}`);
            await loadUsers();
            setMessage(`User ${name} was deleted`);
            setMessageType('success');
            autoClearMessage();
        } catch (err) {
            console.error('Failed to delete user:', err);
            setMessage(`Failed to delete user ${name}`);
            setMessageType('danger');
            autoClearMessage();
        }
    };

    const autoClearMessage = () => {
        setTimeout(() => {
            setMessage('');
        }, 3000);
    };

    return (
        <div className="container">
            <div className="py-4">
                {message && (
                    <div className={`alert alert-${messageType}`} role="alert">
                        {message}
                    </div>
                )}

                <table className="table border shadow">
                    <thead>
                    <tr style={{textAlign: 'left'}}>
                        <th style={{color: '#442d1c'}} scope="col">№</th>
                        <th style={{color: '#442d1c'}}  scope="col">Name</th>
                        <th style={{color: '#442d1c'}} scope="col">Login</th>
                        <th style={{color: '#442d1c'}} scope="col">Role</th>
                        <th style={{color: '#442d1c'}} scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="table-group-divider" style={{color: '#442d1c'}}>
                    {
                        users.map((user, index) => (
                            <tr key={user.id} style={{textAlign: 'left'}}>
                                <td>{index + 1}</td>
                                <td className="ms-3" style={{textAlign: 'left'}}>
                                    <p className="fw-bold mb-1">{user.name}</p>
                                    <p className="text-muted mb-0">{user.email}</p>
                                </td>
                                <td style={{textAlign: 'left'}}>{user.login}</td>
                                <td className="align-middle">
                                    <span className="badge rounded-pill d-inline" style={{backgroundColor: "#92a377"}}>
                                      {user.state ? 'manager' : 'client'}
                                    </span>
                                </td>
                                <td>
                                    {/* !to_change STYLE WILL BE CHANGED */}
                                    <Link className="btn mx-2" to={`/users/view_user/${user.id}`}
                                          style={{backgroundColor: 'white', color: 'blue', borderColor: 'blue'}}>
                                        View
                                    </Link>


                                    <Link className="btn mx-2"
                                          to={`/users/update_user/${user.id}`}
                                          style={{backgroundColor: 'white', color: 'blue', borderColor: 'blue'}}>
                                        Update
                                    </Link>
                                    <button className="btn mx-2"
                                            style={{backgroundColor: 'white', color: 'red', borderColor: 'red'}}
                                            onClick={() => {
                                                deleteUser(user.id, user.name);
                                            }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>

                        ))
                    }
                    </tbody>
                </table>
            </div>
            <Link className="btn mx-2"
                  to={`/users/update_user/$s}`}
                  style={{backgroundColor: 'white', color: 'green', borderColor: 'green'}}
                  onClick={() => {
                      console.log('User will be created by this button')
                  }}>
                Create new user
            </Link>
        </div>
    )
}
