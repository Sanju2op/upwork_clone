import React, { useState } from "react";
import { Button } from "react-bootstrap";

const GetPassword = ({ email, password, setPassword, handleSubmit, handleContinue }) => {

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [passwordError, setPasswordError] = useState(""); 

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        setPasswordError(password.trim() === "" ? "Password cannot be empty" : "");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setPasswordError("Password cannot be empty");
            return;
        }
        setIsLoggingIn(true);
        // Proceed with form submission
        await handleSubmit(password);
        setIsLoggingIn(false);
    };

    return (
        <div id="container">
            <div id="baseDiv">
                <div className="row m-2 mt-5 mb-4">
                    <div className="col">
                        <h1 className="FontStyleHere">Welcome</h1>
                        <h5 className="text text-muted">{email}</h5>
                    </div>
                </div>
                <div className="form">
                    <form>

                        <div className="form-group m-3">
                            <label className="m-2" htmlFor="password">Password : </label>
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={handlePasswordChange} required />
                            {passwordError && <div className="text-danger">{passwordError}</div>}
                        </div>

                        <div className="form-group btn_center" >
                            <span title={passwordError || !password.trim() ? "Password cannot be empty" : " You can Log in now"}
                            >
                                <Button
                                    className="btn btn-success rounded-3 mt-3 py-2 px-4"
                                    type="button"
                                    onClick={handleFormSubmit}
                                    disabled={passwordError || !password.trim() || isLoggingIn}
                                >
                                    {isLoggingIn ? "Logging in..." : "Log in"}
                                </Button>
                            </span>
                        </div>
                    </form>
                    <div onClick={handleContinue} className="p-3 not-you-div">Not you?</div>
                </div>
            </div>
        </div>
    );
};

export default GetPassword;

// const [passwordError, setPasswordError] = useState("");

// const handlePasswordChange = (e) => {
//     const password = e.target.value;
//     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       setPasswordError("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number.");
//     } else {
//       setPasswordError("");
//     }
//     setPassword(password);
//   };
