import React, { useState, useEffect } from 'react';
// import "./manageCategories.css";

const ManageCategories = ({ Back }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories data from your backend API
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data || []);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleDeleteCategory = (categoryId) => {
    // Implement delete functionality for category
    console.log('Delete category with id:', categoryId);
  };

  const handleAddSubcategory = (categoryId) => {
    // Implement add functionality for subcategory
    console.log('Add subcategory for category with id:', categoryId);
  };

  const handleDeleteSubcategory = (categoryId, subcategory) => {
    // Implement delete functionality for subcategory
    console.log('Delete subcategory with id:', subcategory, 'for category with id:', categoryId);
  };

  const handleAddSkill = (categoryId, subcategoryId) => {
    // Implement add functionality for skill
    console.log('Add skill for subcategory with id:', subcategoryId, 'for category with id:', categoryId);
  };

  const handleDeleteSkill = (categoryId, subcategoryId, skillId) => {
    // Implement delete functionality for skill
    console.log('Delete skill with id:', skillId, 'for subcategory with id:', subcategoryId, 'for category with id:', categoryId);
  };

  return (
    <div>
      <h1>Manage Categories</h1>
      <button onClick={Back} className="btn btn-success">Back</button>
      <table className="table mt-3 table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th>Subcategories</th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <ul>
                  {category.subcategories.map(subcategory => (
                    <li key={subcategory._id}>
                      {subcategory.name}
                      <div className="d-inline-block ms-2">
                        <button onClick={() => handleDeleteSubcategory(category._id, subcategory._id)} className="btn btn-sm btn-danger m-1">Delete</button>
                      </div>
                      <ul>
                        {subcategory.skills.map(skill => (
                          <li key={skill._id}>
                            {skill.name}
                            <div className="d-inline-block ms-2">
                              <button onClick={() => handleDeleteSkill(category._id, subcategory._id, skill._id)} className="btn btn-sm btn-danger m-1">Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div>
                        <button onClick={() => handleAddSkill(category._id, subcategory._id)} className="btn btn-sm btn-primary m-1">Add Skill</button>
                        <hr />
                      </div>
                    </li>
                  ))}
                </ul>
                <div>
                  <button onClick={() => handleAddSubcategory(category._id)} className="btn btn-sm btn-primary m-1">Add Subcategory</button>
                </div>
              </td>
              <td>
                <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-sm btn-danger m-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>


      </table>
    </div>
  );
};

export default ManageCategories;
