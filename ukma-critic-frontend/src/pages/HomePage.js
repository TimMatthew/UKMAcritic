import React from "react";
import {Link} from "react-router-dom";

export default function HomePage () {
    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center'}}>
            <Link type="button" to={`/login`}
                  className="btn btn-primary"
                  style={{backgroundColor: 'white', color: 'orange', borderColor: 'orange'}}
            >Login</Link>

            <Link type="button" to={`/users`}
                  className="btn btn-primary"
                  style={{backgroundColor: 'white', color: 'green', borderColor: 'green'}}
            >Users</Link>

            <Link type="button" to={`/films`}
                  className="btn btn-primary"
                  style={{backgroundColor: 'white', color: 'blue', borderColor: 'blue'}}
            >Films</Link>
        </div>
    )
}
