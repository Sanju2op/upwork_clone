import React, { useState, useEffect } from 'react';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import FreelancerDashboard from '../components/dashboard/FreelancerDasboard';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [navigate]);

  return (
    <div className='container'>
      {user && user.userType === 'client' ? (
        <ClientDashboard 
            userData={user}
        />
      ) : (
        <FreelancerDashboard 
        userData={user}
        />
      )}
    </div>
  );
};

export default Dashboard;
