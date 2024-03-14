import React, { useState, useEffect } from "react";
import "./LogIn.css";
import GetEmail from "../components/LogIn/GetEmail";
import GetPassword from "../components/LogIn/GetPassword";
import { useNavigate } from 'react-router-dom';

const LogIn = () => {

  useEffect(() => {
    document.title = "Upwork Login - Login to your Upwork account";
  }, []);

  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      if (response.ok) {
        // Login successful, handle the response
        const data = await response.json();
        console.log('Login successful:', data);
        navigate('/dashboard');
      } else {
        // Login failed, handle the error
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      window.location.reload();
    }
  }

  return (
    <div className="container-fluid">
      {step === 1 ? (
        <GetEmail
          email={email}
          setEmail={setEmail}
          handleContinue={() => setStep(2)}
        />
      ) : (
        <GetPassword
          email={email}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          handleContinue={() => setStep(1)}
        />
      )}
    </div>
  );
};

export default LogIn;