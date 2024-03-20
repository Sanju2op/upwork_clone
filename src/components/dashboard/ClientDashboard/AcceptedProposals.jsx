import React, { useState, useEffect, useCallback } from "react";
import CountryName from "../../CountryName";

const AcceptedProposals = ({ userData, Back }) => {
    const [jobs, setJobs] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [confirmingJob, setConfirmingJob] = useState(false);
    const [filter, setFilter] = useState(null);

    // Fetch jobs for the current user
    const fetchJobs = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/open?userId=${userData._id}`, {
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

    // Fetch proposals for each job
    const fetchProposals = useCallback(async () => {
        try {
            const proposalsData = [];
            for (const job of jobs) {
                const response = await fetch(`http://localhost:5000/api/proposals/${job._id}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch proposals');
                }
                const data = await response.json();
                proposalsData.push(...data);
            }
            setProposals(proposalsData.filter(proposal => proposal.status === 'accepted'));
        } catch (error) {
            console.error(error);
        }
    }, [jobs]); // Include jobs in the dependency array

    useEffect(() => {
        if (jobs.length > 0) {
            fetchProposals();
        }
    }, [jobs, fetchProposals]);

    const ConfirmJobCompletion = async (proposalData) => {
        console.log("Job Id:", proposalData.jobId._id);
        setConfirmingJob(true);

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${proposalData._id}/${proposalData.freelancerId.email}/confirm-completion-client`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to confirm job completion');
            }

            // Refetch proposals to update the job status
            await fetchProposals();
            alert('Job completion confirmed');
        } catch (error) {
            console.error('Error confirming job completion:', error.message);
            // Notify the user of any errors
            alert('Failed to confirm job completion');
        } finally {
            setConfirmingJob(false);
        }
    };

    const ReviseJobCompletion = async (proposalData) => {
        console.log("Job Id:", proposalData.jobId._id);
        const jobId = proposalData.jobId._id;
        if (!jobId) { return };
        setConfirmingJob(true);

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/${proposalData.freelancerId.email}/confirm-completion-revised`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to confirm job Revision');
            }

            // Refetch proposals to update the job status
            await fetchProposals();
            alert('Job Revision confirmed');
        } catch (error) {
            console.error('Error confirming job Revision:', error.message);
            // Notify the user of any errors
            alert('Failed to confirm job Revision');
        } finally {
            setConfirmingJob(false);
        }
    };

    const handleFilter = (status) => {
        setFilter(status);
    };
    const filteredProposals = filter ? proposals.filter(proposal => proposal.jobId.status === filter) : proposals;
    return (
        <div className="container bg-dark p-3 text-light rounded-4">
            <h3>
                <button className="btn btn-success mx-3" onClick={Back}><i className="bi bi-backspace text-white"></i></button>
                Accepted Proposals/Hired Freelancers for Jobs
            </h3>
            <div className="btn-group mb-3">
                <button className="btn btn-primary" onClick={() => setFilter(null)}>All</button>
                <button className="btn btn-primary" onClick={() => handleFilter('under_progression')}>Under Progression</button>
                <button className="btn btn-primary" onClick={() => handleFilter('pending_completion_confirmation')}>Pending Completion Confirmation</button>
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
                            <div className="col-3">
                                <p><strong><i className="bi bi-cash-coin text-success p-1"></i> Rate:</strong> ${proposal.rate}</p>
                            </div>
                            <div className="col-5">
                                <p><strong>Freelancer Name:</strong> {proposal.freelancerId.fullName}</p>
                            </div>
                            <div className="col-4">
                                <p><strong>Job Status: </strong> {proposal.jobId.status}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <p><strong>Job Duration:</strong> {proposal.jobId.duration}</p>
                            </div>
                            <div className="col-5">
                                <p><strong>Freelancer Email:</strong> {proposal.freelancerId.email}</p>
                            </div>
                            <div className="col-4">
                                <p><strong> Job Posted On Date <i className="bi bi-calendar2-event p-1 text-success"></i>:</strong> {new Date(proposal.jobId.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <p><strong>Proposal Status:</strong> {proposal.status}</p>
                            </div>
                            <div className="col-5">
                                <p><strong>Freelancer - <i className="bi bi-geo-alt text-success"></i></strong> <CountryName countryCode={proposal.freelancerId.country} /></p>
                            </div>
                            <div className="col-4">
                                <p><strong>Proposal Submission <i className="bi bi-calendar2-event p-1 text-success"></i>:</strong> {new Date(proposal.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <hr className="mt-0" />
                        <div className="row">
                            {proposal.jobId.status === "pending_completion_confirmation" ? (
                                <div className="col">
                                    <button className="btn btn-primary mx-2" type="button" onClick={() => ConfirmJobCompletion(proposal)} disabled={confirmingJob}>{confirmingJob ? "confirming..." : "Confirm Completion"}</button>
                                    <button className="btn btn-danger mx-2" type="button" onClick={() => ReviseJobCompletion(proposal)} disabled={confirmingJob}>{confirmingJob ? "revising..." : "Revise Completion"}</button>
                                </div>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AcceptedProposals;
