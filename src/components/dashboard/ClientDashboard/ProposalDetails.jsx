import React, { useState, useEffect } from "react";
import CountryName from "../../CountryName";
import { Spinner } from "react-bootstrap";
import PaymentGateway from "./PaymentGateWay";

const ProposalDetails = ({ userData, jobData, Back }) => {
    const [proposals, setProposals] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [acceptingProposal, setAcceptingProposal] = useState(false);
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchProposals = async (jobId) => {
            try {
                const response = await fetch(`http://localhost:5000/api/proposals/${jobId}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch proposals');
                }
                const data = await response.json();
                setProposals(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProposals(jobData._id);
    }, [jobData]);

    const handleAcceptProposal = async () => {
        setAcceptingProposal(true); // Set to true when starting the accept process
        setIsProcessing(true);
    setShowPaymentGateway(true);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate payment process
    setIsProcessing(false);
    setShowPaymentGateway(false);
        try {
            const response = await fetch(`http://localhost:5000/api/proposals/${selectedProposal._id}/accept`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!response.ok) {
                alert('Failed to accept proposal');
                throw new Error('Failed to accept proposal');
            }
            // Update the proposal status locally
            const updatedProposals = proposals.map(p => {
                if (p._id === selectedProposal._id) {
                    return { ...p, status: 'accepted' }; // Update the status to 'accepted'
                }
                return p;
            });
            setProposals(updatedProposals);
            setSelectedProposal({ ...selectedProposal, status: 'accepted' }); // Update the selectedProposal status

            // // Create a contract
            const contract = {
                jobId: selectedProposal.jobId,
                jobTitle: jobData.title,
                jobDescription: jobData.description,
                clientName: userData.fullName,
                freelancerName: selectedProposal.freelancerId.fullName,
                agreedPrice: selectedProposal.rate,
                clientEmail: userData.email,
                freelancerEmail: selectedProposal.freelancerId.email
                // Add more details as needed
            };

            // Save the contract to the database (you need to implement this)
            await saveContract(contract);

            alert("Proposal accepted");
        } catch (error) {
            console.error(error);
        } finally {
            setAcceptingProposal(false); // Reset to false when the accept process is complete
        }
    };

    // Function to save the contract to the database (you need to implement this)
    const saveContract = async (contract) => {
        try {
            const response = await fetch('http://localhost:5000/api/contracts', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contract),
            });
            if (!response.ok) {
                throw new Error('Failed to save contract');
            }
            // Contract saved successfully
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {showPaymentGateway && <PaymentGateway paymentPrice={selectedProposal.rate} />}
      {isProcessing ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div className="container mt-4 p-3 bg-light text-dark rounded">
            <h1>
                <button
                    className="btn btn-success m-1 mb-2 p-2"
                    onClick={Back}
                >
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
                Proposals for Job Title:
            </h1>
            <h4>{jobData.title}</h4>
            <p className="text-muted">Skills Required: {jobData.skillsRequired}</p>
            <h5 className="alert alert-danger">Total Proposals: {proposals.length}</h5>
            {proposals.length > 0 ? (
                <div className="row">
                    <div className={selectedProposal ? "col-4 border border-4 border-secondary rounded-4" : "col-12 border border-4 border-secondary rounded-4"} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <ul className="list-group">
                            {proposals.map((proposal) => (
                                <li key={proposal._id} style={{ "cursor": "pointer" }} className="list-group-item" onClick={() => setSelectedProposal(proposal)}>
                                    <div>
                                        <p>Freelancer: {proposal.freelancerId.fullName}</p>
                                        <small>Skills: <b>{proposal.freelancerId.fullName}</b></small><br />
                                        <small>Status: <b>{proposal.status}</b></small>
                                        <p className="mb-0">Submitted on: <strong>{new Date(proposal.createdAt).toLocaleDateString()} at {new Date(proposal.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {selectedProposal && (
                        <div className="col-8 bg-dark text-light p-4 rounded-4 mr-2">
                            <div>
                                <button className="btn btn-success m-2 rounded-3" onClick={() => setSelectedProposal(null)}><i className="bi bi-x-circle"></i></button>
                                {selectedProposal.status === "pending" && (
                                    <button
                                        className="btn btn-primary m-2 rounded-3"
                                        onClick={handleAcceptProposal}
                                        disabled={acceptingProposal}
                                    >
                                        {acceptingProposal ? "Accepting..." : "Accept Proposal"}
                                    </button>
                                )}
                                <h4>Proposal:</h4>
                                <p>Freelancer: {selectedProposal.freelancerId.fullName}</p>
                                <p>Skills: Dummy Skills for now</p>
                                <hr />
                                <p>CoverLetter: </p>
                                <pre style={{ maxHeight: '200px', overflowY: 'auto', width: "100%", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
                                    {selectedProposal.coverLetter}
                                </pre>

                                <hr />
                                <p>Details</p>
                                <p>Biding: <b>$</b>{selectedProposal.rate}</p>
                                <p>Est. Time: {selectedProposal.duration}</p>
                                <p className="card-text"><i className="bi bi-geo-alt text-success p-1"></i><CountryName countryCode={selectedProposal.freelancerId.country} /></p>
                                <p>Submitted on: {new Date(selectedProposal.createdAt).toLocaleString()}</p>
                                {/* Add other details you want to display */}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>No proposals yet.</p>
            )}
        </div>
        )}
        </div>
    );
};

export default ProposalDetails;
