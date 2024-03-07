import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const EmailVerification = ({ email, handleSubmit }) => {
  const [verificationCodeClient, setVerificationCodeClient] = useState('');

  const verifyCode = (e) => {
    e.preventDefault();

    if (window.confirm(verificationCodeClient)) {
      handleSubmit(verificationCodeClient);
    } else {
      return;
    }
    
  }

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
              onChange={(e) => setVerificationCodeClient(e.target.value)}
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
