import React, { useState, useEffect } from "react";
import "./LogIn.css";
import GetEmail from "../components/LogIn/GetEmail";
import GetPassword from "../components/LogIn/GetPassword";

const LogIn = () => {

  useEffect(() => {
    document.title = "Upwork Login - Login to your Upwork account";
  }, []);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
   return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Email : ", email);
      console.log("Password : ", password);
      console.log("Function executed after 4 seconds");
      setStep(1);
    }, 3000); // 3000 milliseconds = 3 seconds
   });
  }

  return (
    <div className="container-fluid">
      {step === 1 ? (
        <GetEmail
          email={email}
          setEmail={setEmail}
          handleContinue={() => setStep(2)}
        />
      ) : (
        <GetPassword
          email={email}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          handleContinue={() => setStep(1)}
        />
      )}
    </div>
  );
};

export default LogIn;