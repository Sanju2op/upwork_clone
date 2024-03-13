import React, { useState } from "react";
import { Button, Spinner } from "react-bootstrap";

const PaymentGateway = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate payment process
    setIsProcessing(false);
    // Continue with the proposal acceptance
    // Add your logic here
    console.log("Payment completed");
  };

  return (
    <div className="text-center">
      <h2>Payment Gateway</h2>
      {isProcessing ? (
        <div>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Processing payment...</p>
        </div>
      ) : (
        <Button variant="primary" onClick={handlePayment}>
          Pay
        </Button>
      )}
    </div>
  );
};

export default PaymentGateway;
