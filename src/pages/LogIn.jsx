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
          <h1 className="alert alert-primary rounded-5">Remember Your Email and then click Continue</h1>
          <button className="btn btn-success rounded-4" onClick={() => setStep(2)}>
            Continue with email
          </button>
        </>
      ) : (
        <>
          <h1 className="alert alert-primary rounded-5">Remember Your Password and then click Log in</h1>
          <button className="btn btn-success rounded-4" onClick={() => setStep(1)}>
            Log in
          </button>
        </>
      )}
    </div>
  );
};

export default LogIn;