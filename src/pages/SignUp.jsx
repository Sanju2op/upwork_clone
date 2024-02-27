import React, { useState, useEffect} from "react";
import UserType from "../components/UserType";

const SignUp = () => {
  const [userType, setUserType] = useState("");
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (userType !== "") {
      setStep(2); // Move to the next step
    } else {
      alert("Please select a user type.");
    }
  };

  useEffect(() => {
    document.title = "Create an Account - Upwork";
  }, []);
  return (
    <div>
      {step === 1 ? (
        <UserType
          userType={userType}
          setUserType={setUserType}
          handleContinue={handleContinue}
        />
      ) : (
        <div>
          <h2>Welcome, {userType === "client" ? "Client" : "Freelancer"}</h2>
          {/* Add your form or other content here */}
        </div>
      )}
    </div>
  );
};

export default SignUp;
