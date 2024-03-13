import React, { useState, useEffect } from 'react';

const JobEditingForm = ({ updateJob, cancelEdit, initialJobData }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (initialJobData) {
      setJobTitle(initialJobData.title || '');
      setDescription(initialJobData.description || '');
      setSkillsRequired(initialJobData.skillsRequired || '');
      setBudget(initialJobData.budget || '');
      setDuration(initialJobData.duration || '');
    }
  }, [initialJobData]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!jobTitle || !description || !skillsRequired || !budget || !duration) {
      alert('Please fill in all fields');
      return;
    }
  
    if (isNaN(parseFloat(budget))) {
      alert('Budget must be a number');
      return;
    }
  
    const editedJobData = { _id: initialJobData._id, jobTitle, description, skillsRequired, budget, duration };
    updateJob(editedJobData);
  };
  

  return (
    <div className="p-5 text-light bg-dark">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Job Title:</label>
          <input type="text" className="form-control" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills Required:</label>
          <input type="text" className="form-control" value={skillsRequired} onChange={(e) => setSkillsRequired(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Budget:</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input type="text" className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Duration:</label>
          <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary m-4">Update Job</button>
        <button type="button" onClick={cancelEdit} className="btn btn-primary m-4">Cancel</button>
      </form>
    </div>
  );
};

export default JobEditingForm;
