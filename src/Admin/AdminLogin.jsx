import React, { useState, useCallback, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  const fetchAdminData = useCallback(() => {
    fetch('http://localhost:5000/api/admin', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        return response.json();
      })
      .then(data => {
        setAdminData(data.admin);
        navigate('/admin/dashboard');
      })
      .catch(error => {
        // Handle errors, e.g., redirect to login page
        navigate('/admin');
        console.error(error);
        // setAdminData(null); // Set adminData to null to avoid rendering errors
      });
  }, [navigate]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      if (response.ok) {
        // Handle successful login, e.g., redirect to admin dashboard
        alert('Login successful');
        navigate('/admin/dashboard');
      } else {
        // Handle login error
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (adminData) {
    navigate('/admin/dashboard');
  }

  return (
    <div className="container mt-5">
      <h2>Admin Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default AdminLogin;
