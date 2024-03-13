import React, { useState, useEffect } from "react";
import FreelancerProposalDetails from "./FreelancerProposalDetails";

const FreelancerProposals = ({ userData, Back }) => {
    const [proposals, setProposals] = useState([]);
    const [step, setStep] = useState(1);
    const [proposalData, setProposalData] = useState('');

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
    }, [userData]);

    //  console.log(proposals);
    const handleViewProposalDetails = async (proposalData) => {
        await setProposalData(proposalData);
        setStep(2);
    }
    return (
        <div className="container mt-2 bg-dark text-light p-2 rounded-3">
            { step === 1 ?(
                <h1 className="mb-4">
                <button className="btn btn-success m-3" onClick={Back}><i className="bi bi-arrow-left"></i></button>
                My Proposals
            </h1>
            ) : null }
            {step === 1 ? (
                <ul className="list-group">
                    {proposals.map(proposal => (
                        <li key={proposal._id} className="list-group-item d-flex justify-content-between align-items-start">
                            <div>
                                <p><strong>Client:</strong> {proposal.jobId.userId.fullName}</p>
                                <p><strong>Job Title:</strong> {proposal.jobId.title}</p>
                                <p><strong>Date Submitted:</strong> {new Date(proposal.createdAt).toLocaleDateString()} At: {new Date(proposal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Your Bid:</strong> ${proposal.rate}</p>
                                <p><strong>Client's Est. Time:</strong> {proposal.jobId.duration}</p>
                                <p><strong>Status:</strong> {proposal.status}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-primary m-2"
                                    onClick={() => handleViewProposalDetails(proposal)} // Assuming you have a function handleViewProposalDetails
                                >
                                    View Proposal Details
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : step === 2 && proposalData ? (
                <FreelancerProposalDetails
                    Back={() => setStep(1)}
                    proposalData={proposalData}
                />
            ) : null }
        </div>
    );    
};

export default FreelancerProposals;
