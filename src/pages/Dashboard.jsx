import React, { useState, useEffect, useCallback } from 'react';
import ClientDashboard from '../components/dashboard/ClientDashboard/ClientDashboard';
import FreelancerDashboard from '../components/dashboard/FreelancerDashboard/FreelancerDashboard';

import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  const fetchUserData = useCallback(() => {
    fetch('http://localhost:5000/api/user', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(error => {
        // Handle errors, e.g., redirect to login page
        navigate('/login');
        console.error(error);
        setUser(null); // Set user to null to avoid rendering errors
      });
  }, [navigate, setUser]);
  
  
  useEffect(() => {
    fetchUserData();
  }, [navigate, fetchUserData]);
  
  

  return (
    <div className='container'>
  {user && user.userType === 'client' ? (
    <ClientDashboard 
        userData={user}
        fetchUserData={fetchUserData}
    />
  ) : user && user.userType === 'freelancer' ? (
    <FreelancerDashboard 
    userData={user}
    fetchUserData={fetchUserData}
    />
  ) : null }
</div>

  );
};

export default Dashboard;
