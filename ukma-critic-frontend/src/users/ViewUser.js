import React, {useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import api from '../api/AxiosConfig'

export default function ViewUser () {
    const [user, setUser] = React.useState({
        userName: "",
        login: "",
        state: false
    });

    const { id } = useParams();

    useEffect(() => {
        loadUser();
    }, [id]);

    const loadUser = async () => {
        try {
            const responce = await api.get(`/users/${id}`);
            setUser(responce.data);
            console.log(responce.data);
        } catch (err) {
            console.log(err);
        }
    }

    return <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h2 className="text-center m-4">User Details</h2>

                <div className="card">
                    <div className="card-header">
                        Details of user id :
                        <p>{id}</p>
                        <ul className="list-group list-group-flush">

                            <li className="list-group-item">
                                <b>Name: </b>
                                {user.userName}
                            </li>
                            <li className="list-group-item">
                                <b>Login: </b>
                                {user.login}
                            </li>
                            <li className="list-group-item">
                                <b>Role: </b>
                                {user.state ? "Manager" : "Client"}
                            </li>
                            {/*<li className="list-group-item">*/}
                            {/*    <b>Email:</b>*/}
                            {/*    {user.email}*/}
                            {/*</li>*/}
                        </ul>
                    </div>
                </div>
                <Link className="btn btn-primary my-2" to={"/users"}>
                    Back
                </Link>
            </div>
        </div>
    </div>
}