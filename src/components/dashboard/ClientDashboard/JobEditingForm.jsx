import React, { useState, useEffect } from 'react';

function uniqueByKeepOrder(arr, key) {
  let seen = new Set();
  return arr.filter(item => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
}

const JobEditingForm = ({ updateJob, cancelEdit, initialJobData }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    // Fetch categories data from your backend API
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => {
        const categories = data.map(category => category.name);
        const subcategories = data.reduce((acc, category) => {
          category.subcategories.forEach(subcategory => {
            acc.push(subcategory.name);
          });
          return acc;
        }, []);
        const skills = data.reduce((acc, category) => {
          category.subcategories.forEach(subcategory => {
            subcategory.skills.forEach(skill => {
              acc.push(skill.name);
            });
          });
          return acc;
        }, []);

        setCategories(categories || []);
        setSubcategories(subcategories || []);
        setSkills(uniqueByKeepOrder(skills, JSON.stringify) || []);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (selectedSubcategory) {
      // Fetch skills data for the selected subcategory
      fetch(`http://localhost:5000/api/skills?subcategory=${selectedSubcategory}`)
        .then(response => response.json())
        .then(data => {
          setSkills(data || []);
        })
        .catch(error => console.error('Error fetching skills:', error));
    }
  }, [selectedSubcategory]);



  useEffect(() => {
    if (initialJobData) {
      setJobTitle(initialJobData.title || '');
      setDescription(initialJobData.description || '');
      setBudget(initialJobData.budget || '');
      setDuration(initialJobData.duration || '');
      setSelectedCategory(initialJobData.category || '');
      setSelectedSubcategory(initialJobData.subcategory || '');
      setSelectedSkills(initialJobData.skillsRequired || []);
    }
  }, [initialJobData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!jobTitle || !description || !budget || !duration || !selectedCategory || !selectedSubcategory || selectedSkills.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(budget))) {
      alert('Budget must be a number');
      return;
    }

    const editedJobData = { _id: initialJobData._id, jobTitle, description, category: selectedCategory, subcategory: selectedSubcategory, skillsRequired: selectedSkills, budget, duration };
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
          <label className="form-label">Category:</label>
          <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Subcategory:</label>
          <select className="form-select" value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
            <option value="">Select a subcategory</option>
            {subcategories.map(subcategory => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Skills Required:</label>
          {Array.from(new Set(skills)).map(skill => (
            <div key={skill} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={skill}
                checked={selectedSkills.includes(skill)}
                onChange={() => {
                  if (selectedSkills.includes(skill)) {
                    setSelectedSkills(selectedSkills.filter(skl => skl !== skill));
                  } else {
                    setSelectedSkills([...selectedSkills, skill]);
                  }
                }}
              />
              <label className="form-check-label">{skill}</label>
            </div>
          ))}
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
