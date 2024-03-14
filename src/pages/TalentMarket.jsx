import React, { useState, useEffect } from "react";

const TalentMarket = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [user, setUser] = useState(null);

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
        // Handle errors, e.g., redirect to login page
        //navigate('/login');
        console.error(error);
        setUser(null); // Set user to null to avoid rendering errors
      });
  }, []);

  useEffect(() => {
    const fetchFreelancers = async () => {
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchFreelancers();
  }, []);

  // send contact details 
  const handleContact = async (freelancerData) => {
    if (!user) {
      alert("login to contact the freelancer");
      return;
    }
    let message = window.prompt("Enter Message :");
    if (message === null) {
      return;
    }

    if (message.trim() === "") {
      // User entered a blank message, confirm if they want to send it
      if (!window.confirm("Do you want to send a blank message?")) {
        // User does not want to send a blank message, prompt again for a message
        message = window.prompt("Enter Message :");
        if (message === null) {
          // User cancelled the prompt again
          return;
        }
      }
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

  return (
    <div className="container">
      <h1 className="mt-4">Talent Market</h1>
      <div className="row">
        {freelancers.length > 0 ? (
          freelancers.map((freelancer) => (
            <div key={freelancer._id} className="col-lg-4 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body w-100">
                  <img
                    className="img-thumbnail w-25 rounded-circle"
                    src={`http://localhost:5000/${freelancer.profilePhoto}`}
                    alt="YOUR MOM"
                  />
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
    </div>
  );
};

export default TalentMarket;
