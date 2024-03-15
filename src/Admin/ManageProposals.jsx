import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const ManageProposals = ({ proposalData, Back, fetchProposalData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProposalData, setFilteredProposalData] = useState(proposalData);

  const handleProposalsDelete = async (proposalId) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/proposal/${proposalId}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          console.log('Proposal data deleted successfully');
          // Handle any additional logic after successful deletion
          fetchProposalData(); // Assuming you have a function to fetch proposalData
        } else {
          console.error('Failed to delete proposal data');
        }
      } catch (error) {
        console.error('Error deleting proposal data:', error);
      }
    } else {
      return;
    }
  }

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredData = proposalData.filter(proposal =>
      proposal.freelancerId.fullName.toLowerCase().includes(searchTerm) ||
      (proposal.jobId ? proposal.jobId.title.toLowerCase().includes(searchTerm) : false) ||
      proposal.rate.toString().toLowerCase().includes(searchTerm) ||
      proposal.duration.toString().toLowerCase().includes(searchTerm) ||
      proposal.status.toLowerCase().includes(searchTerm)
    );
    setFilteredProposalData(filteredData);
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark" className="mb-4  p-3 text-white border border-3 border-dark">
        <Navbar.Brand>Manage Proposals</Navbar.Brand>
        <Nav className="mr-auto">
          <button className=" btn btn-danger text-white" onClick={Back}>Back</button>
        </Nav>
      </Navbar>
      <h2>Proposal Data:</h2>
      <div className="input-group mb-3">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          className="form-control"
          type="text"
          placeholder="Search proposals by freelancer name, job title, rate, duration, or status"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <table className="table table-dark table-striped table-bordered">
        <thead>
          <tr>
            <th>Freelancer Name</th>
            <th>Job Title</th>
            <th>Rate</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProposalData.map(proposal => (
            <tr key={proposal._id}>
              <td>{proposal.freelancerId.fullName}</td>
              <td>{proposal.jobId ? proposal.jobId.title : "Job data deleted"}</td>
              <td>{proposal.rate}</td>
              <td>{proposal.duration}</td>
              <td>{proposal.status}</td>
              <td>
                <button onClick={() => handleProposalsDelete(proposal._id)} className="btn btn-danger me-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className='border border-3 border-secondary' />
    </div>
  );
}

export default ManageProposals;
