import React, { useState, useEffect } from "react";
import FreelancerProposalDetails from "./FreelancerProposalDetails";

const FreelancerProposals = ({ userData, Back }) => {
    const [proposals, setProposals] = useState([]);
    const [step, setStep] = useState(1);
    const [proposalData, setProposalData] = useState('');
    const [withdrawingProposal, setWithdrawingProposal] = useState(false); // State to track withdrawal process

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
    
    const handleProposalWithdrawal = async (proposal) => {
        setWithdrawingProposal(true);
        try {
            const response = await fetch(`http://localhost:5000/api/proposals/${proposal._id}/withdraw`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to withdraw proposal');
            }
            // Update the proposal status locally
            const updatedProposals = proposals.map(p => {
                if (p._id === proposal._id) {
                    return { ...p, status: 'withdrawn' };
                }
                return p;
            });
            setProposals(updatedProposals);
            alert("Proposal withdrawn");
        } catch (error) {
            console.error(error);
        } finally {
            setWithdrawingProposal(false); // Reset to false when the withdrawal process is complete
        }
    };
    
    return (
        <div className="container mt-2 bg-dark text-light p-2 rounded-3">
            { step === 1 ?(
                <h1 className="mb-4">
                <button className="btn btn-success m-3" onClick={Back}><i className="bi bi-arrow-left"></i></button>
                My Proposals
            </h1>
            ) : null }
            {step === 1 && (
                <ul className="list-group">
                    {proposals.filter(proposal => proposal.status !== "accepted").map(proposal => (
                        <li key={proposal._id} className="list-group-item d-flex justify-content-between align-items-start border border-5 border-dark rounded-4">
                            {/* Proposal details */}
                            <div>
                                <p><strong>Client:</strong> {proposal.jobId.userId.fullName}</p>
                                <p><strong>Job Title:</strong> {proposal.jobId.title}</p>
                                <p><strong>Date Submitted:</strong> {new Date(proposal.createdAt).toLocaleDateString()} At: {new Date(proposal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Your Bid:</strong> ${proposal.rate}</p>
                                <p><strong>Client's Est. Time:</strong> {proposal.jobId.duration}</p>
                                <p><strong>Status:</strong> {proposal.status}</p>
                            </div>
                            {/* Action buttons */}
                            <div className="d-flex align-items-center">
                                <button
                                    className="btn btn-primary m-2"
                                    onClick={() => handleViewProposalDetails(proposal)}
                                >
                                    View Proposal Details
                                </button>
                                { proposal.status === "withdrawn" ? null : (
                                    <button
                                    className="btn btn-danger m-2"
                                    onClick={() => handleProposalWithdrawal(proposal)}
                                    disabled={withdrawingProposal} // Disable button while withdrawing
                                >
                                    {withdrawingProposal ? "Withdrawing..." : "Withdraw Proposal"}
                                </button>   
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {/* Render proposal details */}
            {step === 2 && proposalData && (
                <FreelancerProposalDetails
                    Back={() => setStep(1)}
                    proposalData={proposalData}
                />
            )}
        </div>
    );
};

export default FreelancerProposals;