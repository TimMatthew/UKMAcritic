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


function App() {
    return (
    <div className="App">
        <Router>
            <Navbar/>

            <Routes>
                <Route exact path="/" element={<HomePage/>}></Route>

                <Route exact path="/users" element={<UsersPage/>}></Route>
                <Route exact path="/users/view_user/:id" element={<ViewUser />} />
                <Route exact path="/users/update_user/:id" element={<UpdateUser />} />

                <Route exact path="/films" element={<FilmsPage/>}></Route>
                <Route exact path="/films/add" element={<AddFilms/>}></Route>
            </Routes>
        </Router>
    </div>
    );
}

export default App;
