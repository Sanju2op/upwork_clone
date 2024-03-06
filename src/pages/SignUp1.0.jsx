import React, { useState, useEffect } from "react";
import UserType from "../components/UserType";
import { Form } from 'react-bootstrap';
import EmailVerification from "../components/EmailVerification";
import "./SignUp.css";

const SignUp = () => {
  useEffect(() => {
    document.title = "Create an Account - Upwork";
  }, []);

  const [userType, setUserType] = useState("");
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const countries = [
    {"code":"US","name":"United States"},
    {"code":"CA","name":"Canada"},
    {"code":"GB","name":"United Kingdom"},
  ];

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !country) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code.');
      }

      setStep(3); // Move to the email verification step
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleVerificationSuccess = () => {
    // Here, you would typically submit the signup form data to the database
    // For demonstration purposes, we'll just log the data
    console.log('User signed up:', { fullName, email, password, country, userType });
    alert('User signed up successfully!');
  };

  return (
    <div className="container-fluid">
      {step === 1 ? (
        <UserType
          userType={userType}
          setUserType={setUserType}
          handleContinue={() => setStep(2)} // Move to the next step
        />
      ) : step === 2 ? (
        <div id="container">
          <div id="baseDiv">
            <div className="row m-2 mt-5 mb-4">
              <div className="col">
                <h1 className="FontStyleHere">SignUp to {userType === "client" ? "hire talent " : "find work you love "}</h1>
              </div>
            </div>
            <div className="form">
              <form>
                <div className="form-group m-3">
                  <label className="m-2" htmlFor="fullname">Full Name : </label>
                  <input type="text" className="form-control" id="fullname" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required /> 
                </div>
                <div className="form-group m-3">
                  <label className="m-2" htmlFor="email">Email : </label>
                  <input type="email" className="form-control" id="email" placeholder="Email id" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group m-3">
                  <label className="m-2" htmlFor="password">Password : </label>
                  <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group m-3">
                  <label className="m-2" htmlFor="country">Country : </label>
                  <Form.Select aria-label="Select Country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                    <option>Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </Form.Select>
                </div>
                <div className="form-group btn_center">
                  <button className="btn btn-success rounded-3 mt-3  py-2 px-4" type="button" onClick={handleSignUp}> Sign Up </button>
                </div>
              </form>
              <div className="p-3">Already have an account? <a id="linkStuff" href="/login">Log In</a></div>
            </div>
          </div>
        </div>
      ) : (
        <EmailVerification
          email={email}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default SignUp;
