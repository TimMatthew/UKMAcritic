import React from "react";
import {Link} from "react-router-dom";

export default function FilmsPage() {
    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center'}}>
            <Link type="button" to={`/films/add`}
                  className="btn btn-primary"
                  style={{backgroundColor: 'white', color: 'blue', borderColor: 'blue'}}
            >Add films page</Link>
        </div>
    )
}