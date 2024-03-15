import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const ManageJobs = ({ jobsData, Back, fetchJobData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobsData, setFilteredJobsData] = useState(jobsData);

  const handleJobsDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/job/${jobId}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          console.log('Job data deleted successfully');
          // Handle any additional logic after successful deletion
          fetchJobData(); // Assuming you have a function to fetch jobsData
        } else {
          console.error('Failed to delete job data');
        }
      } catch (error) {
        console.error('Error deleting job data:', error);
      }
    } else {
      return;
    }
  }

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredData = jobsData.filter(job =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.budget.toString().toLowerCase().includes(searchTerm) ||
      job.duration.toString().toLowerCase().includes(searchTerm)
    );
    setFilteredJobsData(filteredData);
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="mb-4  p-3 text-white border border-3 border-dark">
        <Navbar.Brand>Manage Jobs</Navbar.Brand>
        <Nav className="mr-auto">
          <button className=" btn btn-danger text-white" onClick={Back}>Back</button>
        </Nav>
      </Navbar>
      <h2>Job Data:</h2>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          className="form-control"
          type="text"
          placeholder="Search jobs by title, description, budget, or duration"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Budget</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobsData.map(job => (
            <tr key={job._id}>
              <td>{job.title}</td>
              <td>{job.description}</td>
              <td>{job.budget}</td>
              <td>{job.duration}</td>
              <td>
                <button onClick={() => handleJobsDelete(job._id)} className="btn btn-danger me-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className='border border-3 border-secondary' />
    </div>
  );
}

export default ManageJobs;
