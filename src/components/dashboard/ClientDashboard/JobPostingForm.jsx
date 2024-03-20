import React, { useState, useEffect } from 'react';

const JobPostingForm = ({ setJobData, comeBack }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  // const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    // Fetch categories data from your backend API
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    // Fetch available skills based on selected subcategory
    if (selectedSubcategory) {
      fetch(`http://localhost:5000/api/skills?subcategory=${selectedSubcategory}`)
        .then(response => response.json())
        // .then(data => setAvailableSkills(data))
        .catch(error => console.error('Error fetching skills:', error));
    }
  }, [selectedSubcategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedSkills([]);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setSelectedSkills([]);
  };

  const handleSkillAddition = (skill) => {
    setSelectedSkills([...selectedSkills, skill.name]);
  };

  const handleSkillDelete = (skill) => {
    const newSkills = selectedSkills.filter((s) => s !== skill.name);
    setSelectedSkills(newSkills);
  };



  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!jobTitle || !description || !selectedSkills.length || !budget || !duration || !selectedCategory || !selectedSubcategory) {
      alert('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(budget))) {
      alert('Budget must be a number');
      return;
    }

    const newJobData = { jobTitle, description, skillsRequired: selectedSkills, budget, duration, category: selectedCategory, subcategory: selectedSubcategory };
    setJobData(newJobData);
  };


  return (
    <div className="p-3 text-light bg-dark rounded-4">
      <h1 className='m-2'>
        <button type="button" onClick={comeBack} className="btn btn-success m-2">
          <i className="bi bi-arrow-bar-left"></i> Go Back
        </button>
        Post a new Job
      </h1>
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
          <label className="form-label">Category:</label>
          <select className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        {selectedCategory && (
          <div className="mb-3">
            <label className="form-label">Subcategory:</label>
            <select className="form-select" value={selectedSubcategory} onChange={handleSubcategoryChange}>
              <option value="">Select Subcategory</option>
              {categories.find(category => category.name === selectedCategory)?.subcategories.map(subcategory => (
                <option key={subcategory._id} value={subcategory.name}>{subcategory.name}</option>
              ))}
            </select>
          </div>
        )}
        {selectedSubcategory && (
          <div className="mb-3">
            <label className="form-label">Skills Required:</label>
            <div className="mb-2">
              {categories
                .find((category) => category.name === selectedCategory)
                ?.subcategories.find((subcategory) => subcategory.name === selectedSubcategory)
                ?.skills.map((skill) => (
                  <div key={skill.name} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`skill-${skill.name}`}
                      value={skill._id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSkillAddition(skill);
                        } else {
                          handleSkillDelete(skill);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={`skill-${skill.name}`}>
                      {skill.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}



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
