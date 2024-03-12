import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import NaviBar from "./components/NaviBar";
import Home from "./pages/Home";
// import RegisterPage from "./pages/RegisterPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import FreelanceJobs from "./pages/FreelanceJobs";

const App = () => {
  return (
    <Router>
      <NaviBar />
      <div className="container-fluid">
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/login" Component={LogIn} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/freelance-jobs" Component={FreelanceJobs} />
        </Routes>
      </div>
    </Router>
  );
};
export default App;
