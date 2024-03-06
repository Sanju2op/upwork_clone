import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const EmailVerification = ({ email, handleSubmit }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const verifyCode = (e) => {
    e.preventDefault();
    alert(verificationCode);
    handleSubmit(verificationCode);
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // try {
  //   //   const response = await fetch('http://localhost:5000/api/verifyEmail', {
  //   //     method: 'POST',
  //   //     headers: {
  //   //       'Content-Type': 'application/json',
  //   //     },
  //   //     body: JSON.stringify({ email, verificationCode }),
  //   //   });
  //   //   if (response.ok) {
  //   //     onSuccess();
  //   //   } else {
  //   //     alert('Failed to verify email. Please try again.');
  //   //   }
  //   // } catch (error) {
  //   //   console.error('Error verifying email:', error);
  //   //   alert('An error occurred. Please try again.');
  //   // }
  // };



  return (
    <div className="container-fluid">
      <h2>Verify Your Email</h2>
      <p id='veryDesc'>An email with a verification code has been sent to <span id='emailDesc'>{email}</span>. Enter the code below to verify your email.</p>
      <div className='emailVeryForm'>
        <Form onSubmit={verifyCode}>
          <Form.Group controlId="formVerificationCode">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </Form.Group>
          <br />
          <Button variant="success" type="submit">
            Verify Email
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmailVerification;
