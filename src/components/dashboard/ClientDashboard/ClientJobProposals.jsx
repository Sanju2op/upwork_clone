import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import ProposalDetails from "./ProposalDetails";

const ClientJobProposals = ({ userData, comeBack }) => {
    const [jobs, setJobs] = useState([]); 
    const [jobData, setJobData] = useState(null); 
    const [step, setStep] = useState(1);

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

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + "...";
        }
        return description;
    };

    const handleViewProposal = (job) => {
        setJobData(job);
        setStep(2);
    }

    
    return (
        <div className="container mt-4 p-3 bg-dark text-light rounded-4">
           {step === 1 ? (
            <>
             <h1>
                <button
                    className="btn btn-success m-1 mb-2 p-2"
                    onClick={comeBack}
                >
                    <i className="bi bi-arrow-left"></i> Go Back
                </button>
                Your Jobs Proposals
            </h1>
            <Row>
                {jobs.map((job) => (
                    <Col key={job._id} md={4} className="mb-4">
                        <Card className="h-100 d-flex flex-column">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{job.title}</Card.Title>
                                <Card.Text className="flex-grow-1">{truncateDescription(job.description, 100)}</Card.Text>
                                <div className="mt-auto text-end">
                                    <Button variant="success" onClick={() => handleViewProposal(job)}>View Proposals</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            </>
           ): step === 2 && jobData ? (
            <ProposalDetails 
            jobData={jobData}
            userData={userData}
            Back={()=> setStep(1)}
            />
           ):null}
        </div>
    );
};

export default ClientJobProposals;
