import React, { useState, useEffect } from "react";
import CountryName from "../components/CountryName";
import { formatDistanceToNow } from 'date-fns';
const FreelanceJobs = () => {
    // const [step, setStep] = useState(1);
    const [jobs, setJobs] = useState([]);
    
    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs/all');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            // Filter out closed jobs
            const filteredJobs = data.filter(job => job.status !== 'closed');
            setJobs(filteredJobs);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchJobs();
    }, []);
 

    return (  
  <div className="container-fluid p-5 bg-dark text-light rounded-4">
    <h3 className="pb-2 mb-4">Jobs you might like </h3>
  {jobs.map((job, index) => (
    <div key={job.id || index} className="card mb-3">
      <div className="card-body">
        <small className="card-text text-muted">Posted {formatDistanceToNow(new Date(job.lastUpdated), { addSuffix: true })}</small>
        <h4 className="card-title">{job.title}</h4>
        <p className="card-text">Est. Budget: ${job.budget}</p>
        {/* <p className="card-text">{job.description}</p> */}
        <p className="card-text">{job.description.length > 100 ? `${job.description.substring(0, job.description.length / 2)}...` : job.description}</p>
        <p className="card-text">Est. Time: {job.duration}</p>
        <p className="card-text"><svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-geo-alt text-success"
    viewBox="0 0 16 16"
    style={{ width: "1.5em", height: "1.5em", marginLeft: "0.5em" }} // Adjust the size and margin as needed
  >
    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
        </svg> <CountryName countryCode={job.userId.country} /> </p>

      </div>
    </div>
  ))}
</div>
    );
};
export default FreelanceJobs;