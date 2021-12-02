import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";

require("dotenv").config();

const App = () => (
    <div className="main">
        <Router>
            <Routes>
                <Route path=":id/:key" element={<Home />} />
            </Routes>
        </Router>
    </div>
);

export default App;
