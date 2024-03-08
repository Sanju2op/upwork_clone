import React, { useState } from "react";
import { Button } from "react-bootstrap";

const GetEmail = ({setEmail, handleContinue }) => {

  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  return (
    <div id="container">
      <div id="baseDiv">
        <div className="row m-2 mt-5 mb-4">
          <div className="col">
            <h1 className="FontStyleHere">Log in to Upwork</h1>
          </div>
        </div>
        <div className="form">
          <form>

            <div className="form-group m-3">
              <label className="m-2" htmlFor="email">Email : </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                // value={email}
                onChange={handleEmailChange}
                required />
            </div>

            <div className="form-group btn_center" >
              <span title={!isValidEmail ? "Enter Valid Email please" : "You can continue now"}>
                <Button
                  className="btn btn-success rounded-3 mt-3  py-2 px-4"
                  type="button"
                  onClick={handleContinue}
                  disabled={!isValidEmail}
                >
                  Continue with Email
                </Button>
              </span>
            </div>
          </form>
          <div className="p-3"> Don't have an Upwork account? <a id="linkStuff" href="/signup">Sign In</a></div>
        </div>
      </div>
    </div>
  );
};

export default GetEmail;