import React, { useState, useEffect } from "react";
import CountryName from "../../CountryName";

const FreelancerJobs = ({ userData, Back }) => {
    const [proposals, setProposals] = useState([]);
    const [acceptingProposal, setAcceptingProposal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        if (!userData || !userData._id) {
            return;
        }

        const fetchProposals = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/proposals?userId=${userData._id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch proposals');
                }
                const data = await response.json();
                setProposals(data);
            } catch (error) {
                console.error('Error fetching proposals:', error.message);
            }
        };

        fetchProposals();
    }, [userData,  refreshKey]);
    // const acceptedProposals = proposals.filter(proposal => proposal.status === "accepted");
    const acceptedProposals = proposals.filter(proposal => proposal.status === "accepted");
    const filteredProposals = filter ? acceptedProposals.filter(proposal => proposal.jobId.status === filter) : acceptedProposals;

    const ConfirmJobCompletion = async (proposalData) => {
        console.log("Job Id:", proposalData.jobId._id);
        setAcceptingProposal(true);
        
        try {
          const response = await fetch(`http://localhost:5000/api/jobs/${proposalData.jobId._id}/${proposalData.jobId.userId.email}/confirm-completion-freelancer`, {
            method: 'PUT',
            credentials: 'include',
          });
      
          if (!response.ok) {
            throw new Error('Failed to confirm job completion');
          }
      
          // Update the job status locally or fetch updated job data
          const updatedProposal = await response.json();
          setProposals(prevProposals => {
              return prevProposals.map(proposal => {
                  if (proposal._id === updatedProposal._id) {
                      return updatedProposal;
                  }
                  return proposal;
              });
          });
          alert('Job completion confirmed');
          setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
          console.error('Error confirming job completion:', error.message);
          // Notify the user of any errors
          alert('Failed to confirm job completion');
        } finally {
            setAcceptingProposal(false);
        }
      };
      
      const handleFilter = (status) => {
        setFilter(status);
    };

    return (
        <div className="container bg-dark p-3 text-light rounded-4">
            <h1>
            <button className="btn btn-success  mx-3" onClick={Back}><i className="bi bi-backspace text-white"></i></button>
                Your Jobs</h1>
                <div className="btn-group mb-3">
                <button className="btn btn-primary" onClick={() => handleFilter('under_progression')}>Under Progression</button>
                <button className="btn btn-primary" onClick={() => handleFilter('pending_completion_confirmation')}>Pending Completion Confirmation</button>
                <button className="btn btn-primary" onClick={() => setFilter(null)}>Clear Filters</button>
            </div>
            <ul className="list-group">
                {filteredProposals.map(proposal => (
                    <li key={proposal._id} className="list-group-item border border-5 p-3 m-3 rounded-4">
                        <div className="row">
                            <div className="col-12">
                                <h4><i className="bi bi-file-text fs-1 text-success"></i> : {proposal.jobId.title}</h4>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 mt-3">
                                <p><strong>Job Description:</strong> {proposal.jobId.description}</p>
                            </div>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            <div className="col-4">
                                <p><strong><i className="bi bi-cash-coin text-success p-1"></i> Rate:</strong> ${proposal.rate}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Client Name:</strong> {proposal.jobId.userId.fullName}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Job Status: </strong> {proposal.jobId.status}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p><strong>Job Duration:</strong> {proposal.jobId.duration}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Client Email:</strong> {proposal.jobId.userId.email}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Job Posted On:</strong> {new Date(proposal.jobId.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <p><strong>Proposal Status:</strong> {proposal.status}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Client - <i className="bi bi-geo-alt text-success"></i></strong> <CountryName countryCode={proposal.jobId.userId.country} /></p>
                            </div>
                            <div className="col-4">
                                <p><strong><i className="bi bi-calendar2-event p-1 text-success"></i>Proposal Submission Date:</strong> {new Date(proposal.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <hr className="mt-0" />
                        {proposal.jobId.status === "open" || proposal.jobId.status === "under_progression" ?(
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-primary" type="button" onClick={() => ConfirmJobCompletion(proposal)} disabled={acceptingProposal}>
                                {acceptingProposal ? "Confirming..." : "Confirm Completion"}
                                    </button>
                            </div>
                        </div>
                        ):null}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FreelancerJobs;
