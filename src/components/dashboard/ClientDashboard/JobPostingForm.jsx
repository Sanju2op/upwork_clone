import React, { useState } from 'react';

const JobPostingForm = ({ setJobData, comeBack }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');

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
    const newJobData = { jobTitle, description, skillsRequired, budget, duration };
    setJobData(newJobData);
  };

  return (
    <div className="p-3 text-light bg-dark rounded-4">
      <h1 className='m-2'> 
      <button type="button" onClick={comeBack} className="btn btn-success m-2"><i className="bi bi-arrow-bar-left"></i> Go Back</button>
        Post a new Job</h1>
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
    <span className="input-group-text"><b>$</b></span>
    <input type="text" className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)} />
  </div>
</div>
      <div className="mb-3">
        <label className="form-label">Duration:</label>
        <input type="text" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-lg btn-primary mt-1">Post Job</button>
    </form>
    </div>
  );
};

export default JobPostingForm;
