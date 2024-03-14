import React, { useState, useEffect } from "react";
import CountryName from "../components/CountryName";
import { formatDistanceToNow } from 'date-fns';
import ProposalForm from "../components/freelanceJobs/ProposalForm";
import { useNavigate } from 'react-router-dom';

const FreelanceJobs = () => {
  const [step, setStep] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(error => {
        // Handle errors, e.g., redirect to login page
        //navigate('/login');
        console.error(error);
        setUser(null); // Set user to null to avoid rendering errors
      });
  }, []);

  // const fetchJobs = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/jobs/all');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch jobs');
  //     }
  //     const data = await response.json();
  //     // Filter out closed jobs
  //     const filteredJobs = data.filter(job => job.status !== 'closed');
  //     setJobs(filteredJobs);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs/all');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        // Filter out closed jobs
        const filteredJobs = data.filter(job =>
          job.status !== 'closed' &&
          (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
        );

        setJobs(filteredJobs.reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, [searchTerm]);


  const handleJobClick = (job) => {
    // console.log(user.fullName, "objectId:", user.fullName);
    setSelectedJob(job);
    // console.log(selectedJob.title, "objectId:", selectedJob._id);
  };

  const handleProposalForm = () => {
    if (user && user.userType === "freelancer") {
      setStep(2);
    } else if (window.confirm("You have to login as freelancer to apply proposals")) {
      navigate('/login');
      return;
    }
  }

  const handleProposalSubmit = async ({ jobId, freelancerId, coverLetter, rate, duration }) => {
    try {
      const response = await fetch('http://localhost:5000/api/submit-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, freelancerId, coverLetter, rate, duration }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit proposal');
      }

      console.log('Proposal submitted successfully');
      alert('Proposal submitted successfully');
    } catch (error) {
      console.error('Error submitting proposal:', error.message);
    }
  };

  // const filteredJobs = jobs.filter(job =>
  //   job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   job.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  // );


  return (
    <div className="container-fluid p-5 bg-dark text-light rounded-4">
      {step === 1 ? (
        <div className="row">
          {selectedJob && (
            <div className="col-6">
              <div className="container mt-5">
                <p className="btn btn-success rounded-3" onClick={() => setSelectedJob(null)}><i className="bi bi-x-circle"></i></p>
                <br /><small className="card-text text-light"><i className="bi bi-clock-history text-secondary p-1"></i>Posted {formatDistanceToNow(new Date(selectedJob.lastUpdated), { addSuffix: true })}</small>&nbsp;&nbsp;&nbsp;
                <span className="card-text"><i className="bi bi-geo text-primary p-1"></i><CountryName countryCode={selectedJob.userId.country} /></span>

                <h3>{selectedJob.title}</h3>
                <hr />
                {/* <div className="row"> */}
                <div style={{ width: "100%" }} className="col-md-6">
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
                  <button type="button" className="btn btn-primary" onClick={handleProposalForm}>Apply Now</button>
                </div>

                {/* </div> */}
              </div>
            </div>
          )}
          <div className={selectedJob ? "col-6" : "col-12"} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 className="pb-2 mb-4">Jobs you might like </h3>
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search jobs by title, description, or skills"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>
            </div>
            {jobs.map((job, index) => (
              <div key={job.id || index} className="card mb-3">
                <div onClick={() => handleJobClick(job)} className="card-body">
                  <i className="bi bi-clock-history text-primary p-1"></i><small className="card-text text-muted">Posted {formatDistanceToNow(new Date(job.lastUpdated), { addSuffix: true })}</small>
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
                  <p className="card-text"><i className="bi bi-geo-alt text-success p-1"></i><CountryName countryCode={job.userId.country} /> | Proposals : {job.numberOfProposals}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        user && user.userType === 'freelancer' ? (
          <ProposalForm
            setStep={() => setStep(1)}
            jobId={selectedJob._id}
            freelancerId={user._id}
            onSubmit={handleProposalSubmit}
          />
        ) : null
      )}
    </div>
  );
};
export default FreelanceJobs;