import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';


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
          <Route exact path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<DashboardWithRefresh />} />
          <Route path="/freelance-jobs" element={<FreelanceJobs />} />
        </Routes>
      </div>
    </Router>
  );
};

const DashboardWithRefresh = () => {
  useEffect(() => {
    // Refresh NaviBar when dashboard is mounted
    return () => {
      // Clean up if necessary
    };
  }, []);

  return <Dashboard />;
};

export default App;
