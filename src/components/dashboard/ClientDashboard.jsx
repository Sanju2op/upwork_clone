import React, { useState } from "react";
import JobPostingForm from "./JobPostingForm";
import MyJobs from "./MyJobs";

const ClientDashboard = ({ userData }) => {
    //const [jobs, setJobs] = useState([]);
    const [step, setStep] = useState(1);

    const handleJobPost = async (newJobData) => {
        console.log(newJobData);
        try {
            const { jobTitle, description, skillsRequired, budget, duration } = newJobData;

            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userData._id,
                    title: jobTitle,
                    description: description,
                    skillsRequired: skillsRequired,
                    budget: budget,
                    duration: duration
                }),
                credentials: 'include'
            });


            if (!response.ok) {
                throw new Error('Failed to post job');
            }

            alert('Job Posted Successfully');
            setStep(1);
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error);
        }

    };


    return (
        <div className="container-fluid">
            {step === 1 ? (
                <>
                    <h1>Welcome, {userData.fullName}</h1>
                    <button
                        className="btn btn-success m-5"
                        onClick={() => setStep(2)}
                    >
                        Post a New Job
                    </button>
                    <button
                        className="btn btn-success m-5"
                        onClick={() => setStep(3)}
                    >
                        My Jobs
                    </button>
                </>
            ) : step === 2 ? (
                <JobPostingForm
                    setJobData={handleJobPost}
                    comeBack={() => setStep(1)}
                />
            ) : step === 3 ? (
                <MyJobs
                    userData={userData}
                    comeBack={() => setStep(1)}
                />
            ) : null}
        </div>

    );
};

export default ClientDashboard;