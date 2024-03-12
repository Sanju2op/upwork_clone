import React, { useState } from 'react';

const ProposalForm = ({ jobId, freelancerId, onSubmit, setStep }) => {
    const [coverLetter, setCoverLetter] = useState('');
    const [rate, setRate] = useState('');
    const [duration, setDuration] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate fields
        if (!coverLetter || !rate || !duration) {
            alert("Please fill in all the fields.");
            return;
        }

        if (isNaN(rate)) {
            alert("Rate must be a number.");
            return;
        }

        // Disable submit button
        setIsSubmitting(true);

        try {
            // Call onSubmit callback
            await onSubmit({ jobId, freelancerId, coverLetter, rate, duration });

            // Reset form fields and step
            setCoverLetter('');
            setRate('');
            setDuration('');
            setStep();
        } catch (error) {
            console.error('Error submitting proposal:', error.message);
            // Handle error (e.g., display error message to user)
        } finally {
            // Enable submit button
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Submit a Proposal</h1>
            <div className="mb-3">
                <label htmlFor="coverLetter" className="form-label">Cover Letter:</label>
                <textarea className="form-control" id="coverLetter" rows="3" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} required></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="rate" className="form-label">Rate:</label>
                <div className="input-group">
                    <span className="input-group-text"><b>$</b></span>
                    <input type="text" className="form-control" id="rate" value={rate} onChange={(e) => setRate(e.target.value)} required />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration:</label>
                <input type="text" className="form-control" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </button>
        </form>
    );
};

export default ProposalForm;
