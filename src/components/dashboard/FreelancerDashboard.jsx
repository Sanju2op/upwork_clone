import React, { useState } from "react";
import CountryName from "../CountryName";
import FreelancerProposals from "./FreelancerProposals";

const FreelancerDashboard = ({ userData }) => {
  const [step, setStep] = useState(1);
  return (
    <div className="container-fluid">
      {step === 1 ? (
        <>

          <div className="row mt-lg-5 pt-lg-5">
            <div className="col-lg-6">
              <div className="list-group list-group-dashboard">
                <button type="button" className="list-group-item list-group-item-action active" onClick={() => setStep(1)}>
                  Profile
                </button>
                <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(2)}>
                  Proposals
                </button>
                <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(3)}>
                  My Jobs
                </button>
                {/* <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(4)}>
                  Profile
                </button> */}
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <h1>Welcome, {userData.fullName}</h1>
              <p>Email: {userData.email}</p>
              <p>User: {userData.userType}</p>
              {/* <p>Country: {getCountryName(userData.country)}</p> */}
              <p>Country: <CountryName countryCode={userData.country} /></p>
              
            </div>
          </div>
        </>
      ) : step === 2 && userData ? (
        <FreelancerProposals 
        userData={userData}
        Back={() => setStep(1)}
        />
      ) : null}
    </div>
  )
}

export default FreelancerDashboard;