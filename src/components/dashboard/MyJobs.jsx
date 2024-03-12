import React, { useState, useEffect, useCallback } from "react";
import JobEditingForm from "./JobEditingForm";

const MyJobs = ({ userData, comeBack, handleCloseJob }) => {
    const [jobs, setJobs] = useState([]);
    const [editingJob, setEditingJob] = useState(null);
    const [step, setStep] = useState(1);

    // Fetch jobs for the current user
        
    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs?userId=${userData._id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error(error);
        }
    }, [userData]);

    useEffect(() => {
        fetchJobs();
    }, [userData, fetchJobs]);

    const handleEditJob = (jobId) => {
        const jobToEdit = jobs.find(job => job._id === jobId);
        if (jobToEdit) {
         setEditingJob(jobToEdit);
         setStep(2);
        }
      };

    const updateJob = async (updatedJobData) => {
        try {
          const { jobTitle, description, skillsRequired, budget, duration } = updatedJobData;
      
          const response = await fetch(`http://localhost:5000/api/jobs/${updatedJobData._id}`, {
            method: 'PUT',
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
            throw new Error('Failed to update job');
          }
      
          alert('Job Updated Successfully');
          // Optionally, you can handle the updated job data here if needed
          // For example, you can update the job in your local state or re-fetch the job data
          // Or you can just close the edit mode and refresh the job list
          await fetchJobs();
          setEditingJob(null);
          setStep(1)
          // refreshJobList(); // Implement this function to refresh the job list
        } catch (error) {
          console.error('Error updating job:', error);
          alert(error);
        }
      };

    return (
        <div className="container-fluid bg-dark text-light p-3 rounded-3">
           {step === 1 ? (
            <>
            <h1 className="mt-4">Jobs</h1>
            <ul className="list-group">
                {jobs.map(job => (
                    <li key={job._id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div>
                            <h3 className="mb-1">{job.title}</h3>
                            <p className="mb-1">{job.description}</p>
                            <p className="mb-0">Skills Required: <strong>{job.skillsRequired || 'N/A'}</strong></p>
                            <p className="mb-0">Budget: <strong>${job.budget || 'N/A'}</strong></p>
                            <p className="mb-0">Duration: <strong>{job.duration || 'N/A'}</strong></p>
                            <p className="mb-0">Job Posted on: <strong>{new Date(job.createdAt).toLocaleDateString()} At: {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                            <p className="mb-0">Last Updated on: <strong>{new Date(job.lastUpdated).toLocaleDateString()} At: {new Date(job.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                        </div>
                        <div className="d-flex flex-column">
                            <button
                                className="btn btn-primary mb-2"
                                onClick={() => handleEditJob(job._id)}
                            >
                                &nbsp;Edit Job&nbsp;
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleCloseJob(job._id)}
                            >
                                Close Job
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                className="btn btn-success m-5"
                onClick={comeBack}
            >
                Go Back
            </button>
        </>
        
        
        
           ) : (
            <JobEditingForm
              updateJob={updateJob}
              initialJobData={editingJob}
              cancelEdit={() => {setEditingJob(null); setStep(1);}}
            />
           )}
        </div>

    );
};
export default MyJobs;
