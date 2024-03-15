import React, { useEffect, useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavItem, Button, Form } from 'react-bootstrap';
import CountryName from "../components/CountryName";
import { useNavigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageJobs from './ManageJobs';
import ManageProposals from './ManageProposals';

function AdminDashboard() {

  const [userData, setUserData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const [displayData, setDisplayData] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totals, setTotals] = useState({});
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [adminData, setAdminData] = useState([]);

  const fetchAdminData = useCallback(async () => {
    await fetch('http://localhost:5000/api/admin', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch admin data');
        }
        return response.json();
      })
      .then(data => {
        setAdminData(data.admin);
      })
      .catch(error => {
        // Handle errors, e.g., redirect to login page
        navigate('/admin');
        console.error(error);
        setAdminData(null); // Set adminData to null to avoid rendering errors
      });
  }, [navigate, setAdminData]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  useEffect(() => {
    document.title = "Admin | Upwork - clone";
    fetchUserData();
    fetchJobData();
    fetchProposalData();

    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setStartDate(formatDate(sevenDaysAgo));
    setEndDate(formatDate(today));
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        // If logout was successful, redirect the user to the login page
        navigate('/admin'); // Redirect to your login page
      } else {
        console.error('Failed to logout');
        // Handle the error, e.g., show an error message
        alert("failed to log out");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle the error, e.g., show an error message
    }
  };


  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchJobData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/jobs', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      // console.log('Job data:', data);
      setJobData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setJobData([]);
    }
  };

  const fetchProposalData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/proposals', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      // console.log('Proposal data:', data);
      setProposalData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProposalData([]);
    }
  };

  const handleDisplayData = (dataType) => {
    setDisplayData(dataType);
  };

  const handleDateRangeSubmit = useCallback(async () => {
    if (!startDate || !endDate) { return; }
    try {
      const response = await fetch(`http://localhost:5000/api/admin/metrics?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setTotals(data);
    } catch (error) {
      console.error(error);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    handleDateRangeSubmit();
  }, [handleDateRangeSubmit]);

  return (
    <>
      {step === 1 ? (
        <div>
          <Navbar className='mx-0 p-3 mb-3 border border-5 border-secondary' bg="light" expand="lg">
            <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavItem>
                  <Button onClick={() => setStep(2)} className="nav-link">Manage Users</Button>
                </NavItem>
                <NavItem>
                  <Button onClick={() => setStep(3)} className="nav-link"> Manage Jobs</Button>
                </NavItem>
                <NavItem>
                  <Button onClick={() => setStep(4)} className="nav-link"> Manage Proposals</Button>
                </NavItem>
                <NavItem>
                  <Button onClick={handleLogout}>Logout {adminData.username}</Button>
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>

          <div className="container mt-4">
            <div className='mb-5'>
              <h2>Metrics Data:</h2>
              <div className="row bg-dark text-light p-2 mb-5 rounded-4">
                <div className="col-6">
                  <Form.Group className="mb-3" controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">

                  <Form.Group className="mb-3" controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </div>
                {/* <Button onClick={handleDateRangeSubmit}>Fetch Metrics</Button> */}
              </div>
              <table className="table table-dark table-striped table-bordered">
                <thead>
                  <tr>
                    <th>New Signups</th>
                    <th>New Proposals</th>
                    <th>New Jobs</th>
                    <th>Revenue($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{totals.newSignups}</td>
                    <td>{totals.newProposals}</td>
                    <td>{totals.newJobs}</td>
                    <td>${totals.revenue}</td>
                  </tr>
                </tbody>
              </table>
              {/* <hr className='border border-3 border-secondary' /> */}
            </div>
            {/* <hr className='border border-3 border-secondary' /> */}
            {/* {displayData === 'metrics' && ( */}
            {/* )} */}

            <hr className='border border-3 border-secondary' />

            <Button className="me-2" onClick={() => handleDisplayData('all')}>All Data</Button>
            <Button className="me-2" onClick={() => handleDisplayData('users')}>Users Data</Button>
            <Button className="me-2" onClick={() => handleDisplayData('jobs')}>Jobs Data</Button>
            <Button onClick={() => handleDisplayData('proposals')}>Proposals Data</Button>
            <hr className='border border-3 border-secondary' />

            {displayData === 'all' && (
              <div>
                <h2>User Data:</h2>
                <table className="table table-dark table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>User Type</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map(user => (
                      <tr key={user._id} >
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>**********</td>
                        <td>{user.userType}</td>
                        <td><CountryName countryCode={user.country} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
                <h2>Job Data:</h2>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Budget</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobData.map(job => (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.description}</td>
                        <td>{job.budget}</td>
                        <td>{job.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
                <h2>Proposal Data:</h2>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Freelancer Name</th>
                      <th>Job Title</th>
                      <th>Rate</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposalData.map(proposal => (
                      <tr key={proposal._id}>
                        <td>{proposal.freelancerId.fullName}</td>
                        <td>{proposal.jobId ? proposal.jobId.title : "Job data deleted"}</td>
                        <td>{proposal.rate}</td>
                        <td>{proposal.duration}</td>
                        <td>{proposal.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
              </div>

            )}

            {displayData === 'users' && (
              <div>
                <h2>User Data:</h2>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>User Type</th>
                      <th>Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.map(user => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>**********</td>
                        <td>{user.userType}</td>
                        <td><CountryName countryCode={user.country} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
              </div>
            )}

            {displayData === 'jobs' && (
              <div>
                <h2>Job Data:</h2>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Budget</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobData.map(job => (
                      <tr key={job._id}>
                        <td>{job.title}</td>
                        <td>{job.description}</td>
                        <td>${job.budget}</td>
                        <td>{job.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
              </div>
            )}

            {displayData === 'proposals' && (
              <div>
                <h2>Proposal Data:</h2>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Freelancer Name</th>
                      <th>Job Title</th>
                      <th>Rate</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposalData.map(proposal => (
                      <tr key={proposal._id}>
                        <td>{proposal.freelancerId.fullName}</td>
                        <td>{proposal.jobId ? proposal.jobId.title : "Job data deleted"}</td>
                        <td>${proposal.rate}</td>
                        <td>{proposal.duration}</td>
                        <td>{proposal.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr className='border border-3 border-secondary' />
              </div>
            )}
          </div>
        </div>
      ) : step === 2 ? (
        <ManageUsers
          userData={userData}
          fetchUserData={fetchUserData}
          Back={() => setStep(1)}
        />
      ) : step === 3 ? (
        <ManageJobs
          jobsData={jobData}
          fetchJobData={fetchJobData}
          Back={() => setStep(1)}
        />
      ) : step === 4 ? (
        <ManageProposals
          proposalData={proposalData}
          fetchJobData={fetchJobData}
          Back={() => setStep(1)}
        />
      ) : (
        null
      )}
    </>
  );
}

export default AdminDashboard;
