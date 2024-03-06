import React, { useState, useEffect } from "react";
import UserType from "../components/UserType";
// import { Form } from 'react-bootstrap';
import EmailVerification from "../components/EmailVerification";
import SignUpFrom from "../components/SignUpForm";
import "./SignUp.css";

const SignUp = () => {

    useEffect(() => {
        document.title = "Create an Account - Upwork";
    }, []);

    const [userType, setUserType] = useState("");
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    // const [fullName, setFullName] = useState('');
    // const [password, setPassword] = useState('');
    // const [country, setCountry] = useState('');
    // const countries = [
    //     {"code":"US","name":"United States"},
    //     {"code":"CA","name":"Canada"},
    //     {"code":"GB","name":"United Kingdom"},
    //   ];
    
    const handleSignUp = async () => {
        if(!email) {
            alert("fill the email");
        } else {
            alert(userType);
            alert(email);
            // Requesting Verification Code
            try {
                const response = await fetch('http://localhost:5000/api/sendVerificationCode', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }), 
                  credentials: 'include',
                });
          
                if (!response.ok) {
                  throw new Error('Failed to send verification code.');
                }
                setStep(3); // Move to the email verification step
            } catch (error) {
                console.error('Error sending verification code:', error);
                alert('An error occurred. Please try again.');
            }
           
        }
    }

    const handleVerificationSuccess = () => {
      // Here, you would typically submit the sign up form data to the database
      // For demonstration purposes, we'll just log the data
      console.log('User signed up:', {  email, userType });
      alert('User signed up successfully!');
    };

    // Confirming Verification Code
    const handleSubmit = async (verificationCode) => {
        try {
          const response = await fetch('http://localhost:5000/api/verifyEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, verificationCode }),
            credentials: 'include',
          });
          if (response.ok) {
            handleVerificationSuccess();
          } else {
            alert('Failed to verify email. Please try again.');
          }
        } catch (error) {
          console.error('Error verifying email:', error);
          alert('An error occurred. Please try again.');
        }
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
                <SignUpFrom 
                userType={userType}     
                setEmail={setEmail}
                handleSignUp={handleSignUp}
                />
            ) : (
                <EmailVerification 
                email={email}
                handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default SignUp;