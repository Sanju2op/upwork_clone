import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const EmailVerification = ({ email, onSuccess }) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }), 
      });
      if (response.ok) {
        onSuccess(); 
      } else {
        alert('Failed to verify email. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      alert('An error occurred. Please try again.');
    }
  };
  

  return (
    <div>
      <h2>Verify Your Email</h2>
      <p>An email with a verification code has been sent to {email}. Enter the code below to verify your email.</p>
      <Form onSubmit={handleSubmit}>
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
        <Button variant="primary" type="submit">
          Verify Email
        </Button>
      </Form>
    </div>
  );
};

export default EmailVerification;
