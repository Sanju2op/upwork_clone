import React, { useState } from "react";
import JobPostingForm from "./JobPostingForm";
import MyJobs from "./MyJobs";
// import JobEditingForm from "./JobEditingForm";

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


    // const updateJob = async (updatedJobData) => {
    //     try {
    //       const { jobTitle, description, skillsRequired, budget, duration } = updatedJobData;
      
    //       const response = await fetch(`http://localhost:5000/api/jobs/${updatedJobData._id}`, {
    //         method: 'PUT',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //           userId: userData._id,
    //           title: jobTitle,
    //           description: description,
    //           skillsRequired: skillsRequired,
    //           budget: budget,
    //           duration: duration
    //         }),
    //         credentials: 'include'
    //       });
      
    //       if (!response.ok) {
    //         throw new Error('Failed to update job');
    //       }
      
    //       alert('Job Updated Successfully');
    //       // Optionally, you can handle the updated job data here if needed
    //       // For example, you can update the job in your local state or re-fetch the job data
    //       // setJobs(updatedJobData);
    //       // Or you can just close the edit mode and refresh the job list
    //       setEditingJob(null);
    //       // refreshJobList(); // Implement this function to refresh the job list
    //     } catch (error) {
    //       console.error('Error updating job:', error);
    //       alert(error);
    //     }
    //   };
      
      


    return (
        <div className="container-fluid">
  {step === 1 ? (
      <>
      
            <div className="row mt-5 pt-5">
                <div className="col-lg-6">
      <div className="list-group list-group-dashboard">
        <button type="button" className="list-group-item list-group-item-action " onClick={() => setStep(1)}>
          Home
        </button>
        <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(2)}>
          Post a Job
        </button>
        <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(3)}>
          My Jobs
        </button>
        <button type="button" className="list-group-item list-group-item-action" onClick={() => setStep(4)}>
          Profile
        </button>
        </div>
      </div>
        <div className="col-lg-6">
            <h1>Welcome, {userData.fullName}</h1>
        </div>
      </div>
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

        // <div className="container-fluid">
        //     {step === 1 ? (
        //         <>
        //             <h1>Welcome, {userData.fullName}</h1>
        //             <button
        //                 className="btn btn-success m-5"
        //                 onClick={() => setStep(2)}
        //             >
        //                 Post a New Job
        //             </button>
        //             <button
        //                 className="btn btn-success m-5"
        //                 onClick={() => setStep(3)}
        //             >
        //                 My Jobs
        //             </button>
        //         </>
        //     ) : step === 2 ? (
        //         <JobPostingForm
        //             setJobData={handleJobPost}
        //             comeBack={() => setStep(1)}
        //         />
        //     ) : step === 3 ? (
        //         <MyJobs
        //             userData={userData}
        //             comeBack={() => setStep(1)}
        //         />
        //     ) : null}
        // </div>

    );
};

export default ClientDashboard;