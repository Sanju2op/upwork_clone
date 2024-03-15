import React, { useState } from "react";
import CountryName from "../components/CountryName";
import { Navbar, Nav } from 'react-bootstrap';
import EditUser from "./EditUser";

export default function ManageUsers({ userData, Back, fetchUserData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState(1);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const filteredUserData = userData.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserEdit = async (userData) => {
    if (!userData) { return }
    //console.log(userData);
    setSelectedUserData(userData);
    setStep(2);
  }
  const handleUserDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete user's Data")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/user/${userId}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          console.log('User data deleted successfully');
          // Handle any additional logic after successful deletion
          fetchUserData();
        } else {
          console.error('Failed to delete user data');
        }
      } catch (error) {
        console.error('Error deleting user data:', error);
      }
    } else {
      return;
    }
  }



  return (
    <>
      {step === 1 ? (
        <div>
          <Navbar bg="dark" variant="dark" className="mb-4  p-3 text-white border border-3 border-dark">
            <Navbar.Brand>Manage Users</Navbar.Brand>
            <Nav className="mr-auto">
              <button className=" btn btn-danger text-white" onClick={Back}>Back</button>
            </Nav>
          </Navbar>
          <h2>User Data:</h2>
          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              className="form-control"
              type="text"
              placeholder="You can search userData by any given fields"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="table table-dark table-striped table-bordered">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>User Type</th>
                <th>Country</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserData.map(user => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>**********</td>
                  <td>{user.userType}</td>
                  <td><CountryName countryCode={user.country} /></td>
                  <td>
                    <button onClick={() => handleUserDelete(user._id)} className="btn btn-danger me-2">Delete</button>
                    <button onClick={() => handleUserEdit(user)} className="btn btn-primary">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <hr className='border border-3 border-secondary' />
        </div>
      ) : selectedUserData && step === 2 ? (
        <EditUser
          Back={() => setStep(1)}
          userData={selectedUserData}
          fetchUserData={fetchUserData}
        />
      ) : null
      }
    </>
  )
}
