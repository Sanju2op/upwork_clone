import React from "react";
import CountryName from "../../CountryName";

const FreelancerProposalDetails = ({ proposalData,  Back }) => {
    return (
        <div className="container">
                <button className="btn btn-success m-3" onClick={Back}><i className="bi bi-arrow-left"></i> Go Back</button>
            <div className="card">
                <div className="card-header">
                    <h5>Proposal Details</h5>
                </div>
                <div className="card-body">
                    <h4 className="card-title">{proposalData.jobId.title}</h4>
                    <p className="card-text"><strong>Client:</strong> {proposalData.jobId.userId.fullName}</p>
                    <p className="card-text"><strong><i className="bi bi-geo-alt"></i></strong> <CountryName countryCode={proposalData.jobId.userId.country} /></p>
                    <p className="card-text"><strong>Date Submitted:</strong> {new Date(proposalData.createdAt).toLocaleDateString()} at {new Date(proposalData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <hr/>
                    <p className="card-text"><strong>Your Bid:</strong> ${proposalData.rate}</p>
                    <p className="card-text"><strong>Client's Est. Budget:</strong> ${proposalData.jobId.budget}</p>
                    <hr/>
                    <p className="card-text"><strong>Your Duration:</strong> {proposalData.duration}</p>
                    <p className="card-text"><strong>Clients Est. Time:</strong> {proposalData.jobId.duration}</p>
                    <hr/>
                    <p className="card-text"><strong>Status:</strong> {proposalData.status}</p>
                    <p className="card-text"><strong>Cover Letter:</strong></p>
                    <p className="card-text">{proposalData.coverLetter}</p>
                </div>
            </div>
        </div>
    );
};

export default FreelancerProposalDetails;
