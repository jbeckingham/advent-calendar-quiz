import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./calendar/Home";
import Admin from "./admin/Admin";
import New from "./calendar/New";

require("dotenv").config();

const App = () => (
  <div className="main">
    <Router>
      <Routes>
        <Route path=":id/:key" element={<Home />} />
        <Route path=":id/admin" element={<Admin />} />
        <Route path="/" element={<New />} />
      </Routes>
    </Router>
  </div>
);

export default App;
