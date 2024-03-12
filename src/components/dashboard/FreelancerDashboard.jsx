import React from "react";

const FreelancerDashboard = ({ userData }) => {

    return (
        <div>
          <h1>Welcome, Freelancer { userData.fullName }</h1>
        </div>
    )

}

export default FreelancerDashboard;