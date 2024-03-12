import React, { useState, useEffect } from "react";
import CountryName from "../components/CountryName";
import { formatDistanceToNow } from 'date-fns';
const FreelanceJobs = () => {
  // const [step, setStep] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  // const [scrollPosition, setScrollPosition] = useState(0);

  // const handleWheelScroll = (event) => {
  //   const container = document.getElementById('jobListContainer');
  //   const newPosition = scrollPosition + event.deltaY;
  //   if (newPosition >= 0 && newPosition <= container.scrollHeight - container.clientHeight) {
  //     setScrollPosition(newPosition);
  //   }
  // };

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

  const handleJobClick = (job) => {
    console.log(job);
    setSelectedJob(job);
  };

  return (
    <div className="container-fluid p-5 bg-dark text-light rounded-4">
      <div className="row">
        {selectedJob && (
          <div className="col-6">
            <div className="container mt-5">
              <p className="btn btn-success rounded-3" onClick={() => setSelectedJob(null)}><i className="bi bi-x-circle"></i></p>
              <br/><small className="card-text text-light">Posted {formatDistanceToNow(new Date(selectedJob.lastUpdated), { addSuffix: true })}</small>&nbsp;&nbsp;&nbsp;
              <span className="card-text"><i className="bi bi-geo text-primary p-1"></i><CountryName countryCode={selectedJob.userId.country} /></span>

              <h1>{selectedJob.title}</h1>
              <hr />
              {/* <div className="row"> */}
              <div style={{ width: "100%"}} className="col-md-6">
  <h5>Description:</h5>
  <pre style={{ width: "100%", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
    {selectedJob.description}
  </pre>
  <hr />
  <h5>Details:</h5>
  <p><strong>Duration:</strong> {selectedJob.duration}</p>
  <p><strong>Budget:</strong> ${selectedJob.budget}</p>
  <p><strong>Skills Required:</strong> {selectedJob.skillsRequired.join(", ")}</p>
  <hr />
  {/* Add other details you want to display */}
</div>

              {/* </div> */}
            </div>
          </div>
        )}
        <div className={selectedJob ? "col-6" : "col-12"} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <h3 className="pb-2 mb-4">Jobs you might like </h3>
          {jobs.map((job, index) => (
            <div key={job.id || index} className="card mb-3">
              <div onClick={() => handleJobClick(job)} className="card-body">
                <small className="card-text text-muted">Posted {formatDistanceToNow(new Date(job.lastUpdated), { addSuffix: true })}</small>
                <h4 className="card-title">
                  <span style={{ textDecoration: "none", borderBottom: "1px solid transparent" }}
                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
                    {job.title}
                  </span>
                </h4>

                <p className="card-text">Est. Budget: ${job.budget}</p>
                <p className="card-text">{job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}</p>
                {/* <p className="card-text">{job.description.length > 50 ? `${job.description.substring(0, job.description.length / 2)}...` : job.description}</p> */}
                <p className="card-text">Est. Time: {job.duration}</p>
                <p className="card-text">Skills: {job.skillsRequired}</p>
                <p className="card-text"><i className="bi bi-geo-alt text-success p-1"></i><CountryName countryCode={job.userId.country} /></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};
export default FreelanceJobs;