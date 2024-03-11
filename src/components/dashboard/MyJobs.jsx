import React, { useState, useEffect } from "react";

const MyJobs = ({ userData, comeBack }) => {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        // Fetch jobs for the current user
        const fetchJobs = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/jobs?userId=${userData._id}`, {
                    method: 'GET',
                    credentials: 'include', // Include cookies in the request
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error(error);
                // Handle error
            }
        };

        fetchJobs();
    }, [userData]);
    return (
        <div className="container-fluid bg-dark text-light p-3 rounded-3">
            <h1 className="mt-4">Jobs</h1>
            <ul className="list-group">
                {jobs.map(job => (
                    <li key={job._id} className="list-group-item">
                        <h3 className="mb-1">{job.title}</h3>
                        <p className="mb-1">{job.description}</p>
                        <p className="mb-0">Skills Required: {job.skillsRequired}</p>
                        <p className="mb-0">Budget: {job.budget}</p>
                        <p className="mb-0">Duration: {job.duration}</p>
                        {/* Display other job details as needed */}
                    </li>
                ))}
            </ul>
            <button
                className="btn btn-success m-5"
                onClick={comeBack}
            >
                Go Back
            </button>
        </div>
    );
};
export default MyJobs;