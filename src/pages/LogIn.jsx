import React, { useState, useEffect } from "react";

const LogIn = () => {
  useEffect(() => {
    document.title = "Upwork Login - Login to your Upwork account";
  }, []);

  const [step, setStep] = useState(1);

  return (
    <div className="container-fluid">
      {step === 1 ?(
        <>
          <h1 className="alert alert-danger">Remember Your Email and then click Continue</h1>
          <button className="btn btn-success" onClick={() => setStep(2)}>
            Continue with email
          </button>
        </>
      ) : (
        <>
          <h1 className="alert alert-danger">Remember Your Password and then click Log in</h1>
          <button className="btn btn-success" onClick={() => setStep(2)}>
            Log in
          </button>
        </>
      )}
    </div>
  );
};

export default LogIn;