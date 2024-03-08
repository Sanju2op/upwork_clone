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
<div>
<div id="container">
            <div className="border border-3 rounded-4 p-3 mt-5" id="baseDiv">
                <div className="row m-2 mt-5 mb-4">
                    <div className="col">
                        <h1 className="FontStyleHere">Welcome</h1>
                        <h5 className="text-muted">{email}</h5>
                    </div>
                </div>
                <div className="form ">
                    <form>

                        <div className="form-group m-3">
                            <label className="m-2 text-dark" htmlFor="password">Password : </label>
                            <div className="input-group">
                            <span className="input-group-text">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" role="img" width="16" height="16">
        <rect width="24" height="24" fill="none"></rect>
        <path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 21a7 7 0 100-14 7 7 0 000 14z"></path>
        <path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15.8 8V7c0-2.3-1.8-4.2-4-4.2s-4 1.9-4 4.2v1"></path>
        <path fill="var(--icon-color, #001e00)" vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 14a1 1 0 100-2 1 1 0 000 2z"></path>
        <path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M12 16.857V14"></path>
    </svg>
                            </span>
                            <input type="password" className="form-control" id="password" placeholder="Password" onChange={handlePasswordChange} required />
                            {passwordError && <div className="text-danger">{passwordError}</div>}
                            </div>
                        </div>



                        <div className="form-group m-3">
                            <input id="loggedin" type="checkbox" className=" alert alert-success form-check-input p-1 mt-2" /> 
                            <label 
                            htmlFor="loggedin" 
                            >&nbsp; <span className="text-muted">Keep me logged in
                            </span></label>
                        </div>

                        <div className="form-group btn_center" >
                            <span title={passwordError || !password.trim() ? "Password cannot be empty" : " You can Log in now"}
                            >
                                <Button
                                    className="btn btn-success rounded-5 mt-3 py-2 px-4"
                                    type="button"
                                    onClick={handleFormSubmit}
                                    disabled={passwordError || !password.trim() || isLoggingIn}
                                >
                                    {isLoggingIn ? "Logging in..." : "Log in"}
                                </Button>
                            </span>
                        </div>
                    </form>
                    <div className="row m-4">
                        <div className="col-6 px-0 mx-0 text-justify">
                        <div className="px-0 mx-0"><a className="not-you-div" href="/forgotpassword"> Forgot password?</a></div>
                        </div>
                        <div className="col-6 px-0 mx-0">
                            <div className="px-0 mx-0"><span className="not-you-div" onClick={handleContinue}>Not you?</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="container" className=" bg-dark mt-5 mb-3 py-4 text-light rounded-4">
            <small className="m-3 p-4">© 2015 - 2024 Upwork® Global Inc. • <a id="pry-poy" href="/privacypolicy">Privacy Policy</a></small>
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
