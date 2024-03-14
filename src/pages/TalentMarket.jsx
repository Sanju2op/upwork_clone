import React, { useState, useEffect } from "react";

const TalentMarket = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => {
        setUser(data.user);
      })
      .catch(error => {
        console.error(error);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/freelancers', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (!response.ok) {
          throw new Error('Failed to fetch freelancers');
        }
        const data = await response.json();
        setFreelancers(data.freelancers);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [searchTerm]);

  const handleContact = async (freelancerData) => {
    if (!user) {
      alert("Login to contact the freelancer");
      return;
    }
    let message = window.prompt("Enter Message :");
    if (message === null || message.trim() === "") {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact-freelancer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          freelancerFullName: freelancerData.fullName,
          freelancerEmail: freelancerData.email,
          ClientFullName: user.fullName,
          ClientEmail: user.email,
          ClientMessage: message,
        }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Failed to contact freelancer');
      }

      alert('Contact request sent successfully');
    } catch (error) {
      console.error('Error contacting freelancer:', error);
      alert('Failed to contact freelancer. Please try again later.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFreelancers = freelancers.filter((freelancer) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      freelancer.fullName.toLowerCase().includes(searchTermLower) ||
      freelancer.description.toLowerCase().includes(searchTermLower) ||
      freelancer.skills.some((skill) => skill.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div className="container">
      <h1 className="mt-4">Talent Market</h1>
      <div className="mb-4 input-group">
        <input
          type="text"
          placeholder="Search by name, description, or skills"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map((freelancer) => (
              <div key={freelancer._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body w-100">
                    {freelancer.profilePhoto ? (
                      <img
                        className="img-thumbnail w-25 rounded-circle"
                        src={`http://localhost:5000/${freelancer.profilePhoto}`}
                        alt={freelancer.fullName}
                      />
                    ) : (
                      <i className="bi bi-person-circle text-success fs-1"></i>
                    )}
                    <h5 className="card-title">{freelancer.fullName}</h5>
                    <p className="card-text">{freelancer.description}</p>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-success rounded" onClick={() => handleContact(freelancer)}>Contact</button>
                    <small className="text- mx-2"><b>Skills: </b> {freelancer.skills.join(", ")}</small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col">
              <h3>No freelancers available</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalentMarket;
