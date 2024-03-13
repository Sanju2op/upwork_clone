import React, { useState, useEffect, useCallback } from "react";
import JobEditingForm from "./JobEditingForm";

const MyJobs = ({ userData, comeBack }) => {
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

    const handleCloseJob = async (jobId) => {
        if (!window.confirm("Are You sure you want to close this job")) { return }
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/close`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to close job');
            }
            await fetchJobs();
            alert('Job Closed Successfully');
        } catch (error) {
            console.error('Error closing job:', error);
            // Handle error
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are You sure you want to Delete this job")) { return }
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete job');
            }
            // Update the jobs list after deleting the job
            await fetchJobs();
            alert('Job deleted successfully');
        } catch (error) {
            console.error('Error deleting job:', error);
            alert(error.message);
        }
    };



    return (
        <div className="container-fluid bg-dark text-light p-2  mb-5 rounded-3">
            {step === 1 ? (
                <>
                    <h1 className="m-1"> 
                <button
                    className="btn btn-success m-1"
                    onClick={comeBack}
                >
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
                Your Jobs</h1>
                <div style={{ maxHeight: '600px', overflowY: 'scroll' }}>
                    <ul className="list-group">
                        {jobs.map(job => (
                            <li key={job._id} className="list-group-item d-flex justify-content-between align-items-start">
                                <div>
                                    <h4 className="mb-1">{job.title}</h4>
                                    {/* <p className="mb-1">{job.description}</p> */}
                                    <p className="card-text">{job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}</p>
                                    
                                    <p className="mb-0">Skills Required: <strong>{job.skillsRequired || 'N/A'}</strong></p>
                                    <p className="mb-0">Budget: <strong>${job.budget || 'N/A'}</strong></p>
                                    <p className="mb-0">Duration: <strong>{job.duration || 'N/A'}</strong></p>
                                    <p className="mb-0">Status: <strong>{job.status || 'N/A'}</strong></p>
                                    <p className="mb-0">Job Posted on: <strong>{new Date(job.createdAt).toLocaleDateString()} At: {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                                    <p className="mb-0">Last Updated on: <strong>{new Date(job.lastUpdated).toLocaleDateString()} At: {new Date(job.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                                </div>
                                <div className="d-flex flex-column">
                                    {job.status !== 'closed' && ( // Only render the buttons if the job is not closed
                                        <>
                                            <button
                                                className="btn btn-primary mb-2"
                                                onClick={() => handleEditJob(job._id)}
                                            >
                                                &nbsp;&nbsp;Edit Job&nbsp;&nbsp;
                                            </button>
                                            <button
                                                className="btn btn-warning mb-2"
                                                onClick={() => handleCloseJob(job._id)}
                                            >
                                                &nbsp;Close Job&nbsp;
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteJob(job._id)} // Assuming you have a function handleDeleteJob
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </>
            

            ) : (
                <JobEditingForm
                    updateJob={updateJob}
                    initialJobData={editingJob}
                    cancelEdit={() => { setEditingJob(null); setStep(1); }}
                />
            )}
        </div>

    );
};
export default MyJobs;
