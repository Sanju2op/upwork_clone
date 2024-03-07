import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
const SignUpFrom = ({ userType, setFullName, setEmail, setPassword, countries, setCountry, handleSignUp }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUpClick = async () => {
    setIsSigningUp(true);
    await handleSignUp();
    setIsSigningUp(false);
  };
  return (
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
              <input type="text" className="form-control" id="fullname" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group m-3">
              <label className="m-2" htmlFor="email">Email : </label>
              <input type="email" className="form-control" id="email" placeholder="Email id" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group m-3">
              <label className="m-2" htmlFor="password">Password : </label>
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-group m-3">
              <label className="m-2" htmlFor="country">Country : </label>
              <Form.Select aria-label="Select Country" onChange={(e) => setCountry(e.target.value)} required>
                <option>Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </Form.Select>
            </div>

            <div className="form-group btn_center">
              <Button
                className="btn btn-success rounded-3 mt-3  py-2 px-4"
                type="button"
                onClick={handleSignUpClick}
                disabled={isSigningUp}
              >
                {isSigningUp ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
          </form>
          <div className="p-3">Already have an account? <a id="linkStuff" href="/login">Log In</a></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpFrom;