import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const EmailVerification = ({ email, handleSubmit }) => {
  const [verificationCodeClient, setVerificationCodeClient] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const verifyCode = async (e) => {
    e.preventDefault();

    if (!verificationCodeClient) {
      setError('Verification code is required');
      return;
    }

    if (isNaN(verificationCodeClient)) {
      setError('Verification code must be a number');
      return;
    }

    setIsVerifying(true);
    await handleSubmit(verificationCodeClient);
    setIsVerifying(false);
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
              onChange={(e) => {
                setVerificationCodeClient(e.target.value);
                setError('');
              }}
              isInvalid={!!error}
              required
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <br />
          <Button
            variant="success"
            type="submit"
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmailVerification;
