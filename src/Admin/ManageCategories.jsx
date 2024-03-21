import React, { useState, useEffect } from 'react';
// import "./manageCategories.css";

const ManageCategories = ({ Back }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const fetchCategories = async () => {
    // Fetch categories data from your backend API
    fetch('http://localhost:5000/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data || []);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory, subcategories: [] }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to add category');
      }
      const data = await response.json();
      setCategories(prevCategories => [...prevCategories, data.category]);
      alert('Category added successfully');
      // Handle any other necessary updates or redirects
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };


  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      await fetchCategories();
      alert('Category deleted successfully');
      // Handle any other necessary updates or redirects
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };


  // Update handleAddSubcategory function
  const handleAddSubcategory = async (categoryId) => {
    if (newSubcategory.trim() === '') {
      alert('Please enter a subcategory name');
      return;
    }

    await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newSubcategory }),
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add subcategory');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns the updated category, update the state
        setCategories(prevCategories => {
          const updatedCategories = prevCategories.map(cat => {
            if (cat._id === categoryId) {
              return data.category;
            }
            return cat;
          });
          return updatedCategories;
        });
        setNewSubcategory('');
      })
      .catch(error => {
        console.error('Error adding subcategory:', error);
        alert('Failed to add subcategory');
      });
  };


  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories/${subcategoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete subcategory');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns the updated category, update the state
        setCategories(prevCategories => {
          const updatedCategories = prevCategories.map(cat => {
            if (cat._id === categoryId) {
              return data.category;
            }
            return cat;
          });
          return updatedCategories;
        });
      })
      .catch(error => {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
      });
  };


  const handleAddSkill = async (categoryId, subcategoryId) => {
    if (newSkill.trim() === '') {
      alert('Please enter a skill name');
      return;
    }

    try {
      // Make the POST request to add the skill
      const response = await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories/${subcategoryId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newSkill }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to add skill');
      }

      // Update the categories state without calling fetchCategories
      setCategories(prevCategories => {
        const updatedCategories = prevCategories.map(category => {
          if (category._id === categoryId) {
            const updatedSubcategories = category.subcategories.map(subcategory => {
              if (subcategory._id === subcategoryId) {
                return {
                  ...subcategory,
                  skills: [...subcategory.skills, { name: newSkill }],
                };
              }
              return subcategory;
            });
            return {
              ...category,
              subcategories: updatedSubcategories,
            };
          }
          return category;
        });
        return updatedCategories;
      });

      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill');
    }
  };




  const handleDeleteSkill = async (categoryId, subcategoryId, skillId) => {
    if (skillId === undefined) {
      fetchCategories();
      alert('Click Delete Once more for confirmation');
      return;
    }

    await fetch(`http://localhost:5000/api/categories/${categoryId}/subcategories/${subcategoryId}/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete skill');
        }
        return response.json();
      })
      .then(data => {
        // Update the state without calling fetchCategories
        setCategories(prevCategories => {
          const updatedCategories = prevCategories.map(cat => {
            if (cat._id === categoryId) {
              const updatedSubcategories = cat.subcategories.map(subcat => {
                if (subcat._id === subcategoryId) {
                  const updatedSkills = subcat.skills.filter(skill => skill._id !== skillId);
                  return { ...subcat, skills: updatedSkills };
                }
                return subcat;
              });
              return { ...cat, subcategories: updatedSubcategories };
            }
            return cat;
          });
          return updatedCategories;
        });
      })
      .catch(error => {
        console.error('Error deleting skill:', error);
        alert('Failed to delete skill');
      });
  };

  return (
    <div>{!categories ? (<h1>loading...</h1>) : (
      <>
        <h1>Manage Categories</h1>
        <button onClick={Back} className="btn btn-success">Back</button>
        <div className="m-3 bg-dark p-3">
          <input
            id="newCate"
            type="text"
            className="form-control"
            placeholder="Add New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory} className="btn btn-primary mt-2">Add Category</button>
        </div>
        <table className="table mt-3 table-dark table-striped table-bordered">
          <thead>
            <tr>
              <th>Category</th>
              <th>Subcategories / Skills</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.map(category => (
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
                          {subcategory.skills && subcategory.skills.map(skill => (
                            <li key={skill._id}>
                              {skill.name}
                              <div className="d-inline-block ms-2">
                                <button onClick={() => handleDeleteSkill(category._id, subcategory._id, skill._id)} className="btn btn-sm btn-danger m-1">Delete</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div>
                          <input
                            id={subcategory._id}
                            type="text"
                            className="form-control mt-2"
                            placeholder="Add New Skill"
                            // value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                          />
                          {/* <button onClick={() => handleAddSkill(category._id, subcategory._id)} className="btn btn-primary mt-2">Add Skill</button> */}
                          <button onClick={() => handleAddSkill(category._id, subcategory._id)} className="btn btn-sm btn-primary m-1">Add Skill</button>
                          <hr />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <input
                      id={category._id}
                      type="text"
                      className="form-control mt-2"
                      placeholder="Add New Subcategory"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                    />
                    {/* <button onClick={() => handleAddSubcategory(category._id)} className="btn btn-primary mt-2">Add Subcategory</button> */}
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

      </>
    )}</div>
  );
};

export default ManageCategories;
