import React, { useState } from "react";
import CountryName from "../../CountryName";
import FreelancerProposals from "./FreelancerProposals";
import FreelancerJobs from "./FreelancerJobs";
import { Form } from "react-bootstrap";

const FreelancerDashboard = ({ userData, fetchUserData }) => {
  const [step, setStep] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const countries = [
    { "code": "US", "name": "United States" },
    { "code": "CA", "name": "Canada" },
    { "code": "GB", "name": "United Kingdom" },
    { "code": "AU", "name": "Australia" },
    { "code": "AE", "name": "United Arab Emirates" },
    { "code": "AF", "name": "Afghanistan" },
    { "code": "AG", "name": "Antigua and Barbuda" },
    { "code": "AI", "name": "Anguilla" },
    { "code": "AL", "name": "Albania" },
    { "code": "AM", "name": "Armenia" },
    { "code": "AO", "name": "Angola" },
    { "code": "AQ", "name": "Antarctica" },
    { "code": "AR", "name": "Argentina" },
    { "code": "AS", "name": "American Samoa" },
    { "code": "AT", "name": "Austria" },
    { "code": "AW", "name": "Aruba" },
    { "code": "AX", "name": "Åland Islands" },
    { "code": "AZ", "name": "Azerbaijan" },
    { "code": "BA", "name": "Bosnia and Herzegovina" },
    { "code": "BB", "name": "Barbados" },
    { "code": "BD", "name": "Bangladesh" },
    { "code": "BE", "name": "Belgium" },
    { "code": "BF", "name": "Burkina Faso" },
    { "code": "BG", "name": "Bulgaria" },
    { "code": "BH", "name": "Bahrain" },
    { "code": "BI", "name": "Burundi" },
    { "code": "BJ", "name": "Benin" },
    { "code": "BL", "name": "Saint Barthélemy" },
    { "code": "BM", "name": "Bermuda" },
    { "code": "BN", "name": "Brunei Darussalam" },
    { "code": "BO", "name": "Bolivia (Plurinational State of)" },
    { "code": "BQ", "name": "Bonaire, Sint Eustatius and Saba" },
    { "code": "BR", "name": "Brazil" },
    { "code": "BS", "name": "Bahamas" },
    { "code": "BT", "name": "Bhutan" },
    { "code": "BV", "name": "Bouvet Island" },
    { "code": "BW", "name": "Botswana" },
    { "code": "BY", "name": "Belarus" },
    { "code": "BZ", "name": "Belize" },
    { "code": "CC", "name": "Cocos (Keeling) Islands" },
    { "code": "CD", "name": "Congo, Democratic Republic of the" },
    { "code": "CF", "name": "Central African Republic" },
    { "code": "CG", "name": "Congo" },
    { "code": "CI", "name": "Côte d'Ivoire" },
    { "code": "CK", "name": "Cook Islands" },
    { "code": "CL", "name": "Chile" },
    { "code": "CM", "name": "Cameroon" },
    { "code": "CN", "name": "China" },
    { "code": "CO", "name": "Colombia" },
    { "code": "CR", "name": "Costa Rica" },
    { "code": "CU", "name": "Cuba" },
    { "code": "CV", "name": "Cabo Verde" },
    { "code": "CW", "name": "Curaçao" },
    { "code": "CX", "name": "Christmas Island" },
    { "code": "CY", "name": "Cyprus" },
    { "code": "CZ", "name": "Czech Republic" },
    { "code": "DJ", "name": "Djibouti" },
    { "code": "DK", "name": "Denmark" },
    { "code": "DM", "name": "Dominica" },
    { "code": "DO", "name": "Dominican Republic" },
    { "code": "DZ", "name": "Algeria" },
    { "code": "EC", "name": "Ecuador" },
    { "code": "EE", "name": "Estonia" },
    { "code": "EG", "name": "Egypt" },
    { "code": "EH", "name": "Western Sahara" },
    { "code": "ER", "name": "Eritrea" },
    { "code": "ES", "name": "Spain" },
    { "code": "ET", "name": "Ethiopia" },
    { "code": "FI", "name": "Finland" },
    { "code": "FJ", "name": "Fiji" },
    { "code": "FK", "name": "Falkland Islands (Malvinas)" },
    { "code": "FM", "name": "Micronesia (Federated States of)" },
    { "code": "FO", "name": "Faroe Islands" },
    { "code": "GA", "name": "Gabon" },
    { "code": "GD", "name": "Grenada" },
    { "code": "GE", "name": "Georgia" },
    { "code": "GF", "name": "French Guiana" },
    { "code": "GG", "name": "Guernsey" },
    { "code": "GH", "name": "Ghana" },
    { "code": "GI", "name": "Gibraltar" },
    { "code": "GL", "name": "Greenland" },
    { "code": "GM", "name": "Gambia" },
    { "code": "GN", "name": "Guinea" },
    { "code": "GP", "name": "Guadeloupe" },
    { "code": "GQ", "name": "Equatorial Guinea" },
    { "code": "GR", "name": "Greece" },
    { "code": "GS", "name": "South Georgia and the South Sandwich Islands" },
    { "code": "GT", "name": "Guatemala" },
    { "code": "GU", "name": "Guam" },
    { "code": "GW", "name": "Guinea-Bissau" },
    { "code": "GY", "name": "Guyana" },
    { "code": "HK", "name": "Hong Kong" },
    { "code": "HM", "name": "Heard Island and McDonald Islands" },
    { "code": "HN", "name": "Honduras" },
    { "code": "HR", "name": "Croatia" },
    { "code": "HT", "name": "Haiti" },
    { "code": "HU", "name": "Hungary" },
    { "code": "ID", "name": "Indonesia" },
    { "code": "IE", "name": "Ireland" },
    { "code": "IL", "name": "Israel" },
    { "code": "IM", "name": "Isle of Man" },
    { "code": "IN", "name": "India" },
    { "code": "IO", "name": "British Indian Ocean Territory" },
    { "code": "IQ", "name": "Iraq" },
    { "code": "IR", "name": "Iran, Islamic Republic of" },
    { "code": "IS", "name": "Iceland" },
    { "code": "IT", "name": "Italy" },
    { "code": "JE", "name": "Jersey" },
    { "code": "JM", "name": "Jamaica" },
    { "code": "JO", "name": "Jordan" },
    { "code": "JP", "name": "Japan" },
    { "code": "KE", "name": "Kenya" },
    { "code": "KG", "name": "Kyrgyzstan" },
    { "code": "KH", "name": "Cambodia" },
    { "code": "KI", "name": "Kiribati" },
    { "code": "KM", "name": "Comoros" },
    { "code": "KN", "name": "Saint Kitts and Nevis" },
    { "code": "KP", "name": "Korea, Democratic People's Republic of" },
    { "code": "KR", "name": "Korea, Republic of" },
    { "code": "KW", "name": "Kuwait" },
    { "code": "KY", "name": "Cayman Islands" },
    { "code": "KZ", "name": "Kazakhstan" },
    { "code": "LA", "name": "Lao People's Democratic Republic" },
    { "code": "LB", "name": "Lebanon" },
    { "code": "LC", "name": "Saint Lucia" },
    { "code": "LI", "name": "Liechtenstein" },
    { "code": "LK", "name": "Sri Lanka" },
    { "code": "LR", "name": "Liberia" },
    { "code": "LS", "name": "Lesotho" },
    { "code": "LT", "name": "Lithuania" },
    { "code": "LU", "name": "Luxembourg" },
    { "code": "LV", "name": "Latvia" },
    { "code": "LY", "name": "Libya" },
    { "code": "MA", "name": "Morocco" },
    { "code": "MC", "name": "Monaco" },
    { "code": "MD", "name": "Moldova, Republic of" },
    { "code": "ME", "name": "Montenegro" },
    { "code": "MF", "name": "Saint Martin (French part)" },
    { "code": "MG", "name": "Madagascar" },
    { "code": "MH", "name": "Marshall Islands" },
    { "code": "MK", "name": "Macedonia, the former Yugoslav Republic of" },
    { "code": "ML", "name": "Mali" },
    { "code": "MM", "name": "Myanmar" },
    { "code": "MN", "name": "Mongolia" },
    { "code": "MO", "name": "Macao" },
    { "code": "MP", "name": "Northern Mariana Islands" },
    { "code": "MQ", "name": "Martinique" },
    { "code": "MR", "name": "Mauritania" },
    { "code": "MS", "name": "Montserrat" },
    { "code": "MT", "name": "Malta" },
    { "code": "MU", "name": "Mauritius" },
    { "code": "MV", "name": "Maldives" },
    { "code": "MW", "name": "Malawi" },
    { "code": "MX", "name": "Mexico" },
    { "code": "MY", "name": "Malaysia" },
    { "code": "MZ", "name": "Mozambique" },
    { "code": "NA", "name": "Namibia" },
    { "code": "NC", "name": "New Caledonia" },
    { "code": "NE", "name": "Niger" },
    { "code": "NF", "name": "Norfolk Island" },
    { "code": "NG", "name": "Nigeria" },
    { "code": "NI", "name": "Nicaragua" },
    { "code": "NL", "name": "Netherlands" },
    { "code": "NO", "name": "Norway" },
    { "code": "NP", "name": "Nepal" },
    { "code": "NR", "name": "Nauru" },
    { "code": "NU", "name": "Niue" },
    { "code": "NZ", "name": "New Zealand" },
    { "code": "OM", "name": "Oman" },
    { "code": "PA", "name": "Panama" },
    { "code": "PE", "name": "Peru" },
    { "code": "PF", "name": "French Polynesia" },
    { "code": "PG", "name": "Papua New Guinea" },
    { "code": "PH", "name": "Philippines" },
    { "code": "PK", "name": "Pakistan" },
    { "code": "PL", "name": "Poland" },
    { "code": "PM", "name": "Saint Pierre and Miquelon" },
    { "code": "PN", "name": "Pitcairn" },
    { "code": "PR", "name": "Puerto Rico" },
    { "code": "PS", "name": "Palestine, State of" },
    { "code": "PT", "name": "Portugal" },
    { "code": "PW", "name": "Palau" },
    { "code": "PY", "name": "Paraguay" },
    { "code": "QA", "name": "Qatar" },
    { "code": "RE", "name": "Réunion" },
    { "code": "RO", "name": "Romania" },
    { "code": "RS", "name": "Serbia" },
    { "code": "RU", "name": "Russian Federation" },
    { "code": "RW", "name": "Rwanda" },
    { "code": "SA", "name": "Saudi Arabia" },
    { "code": "SB", "name": "Solomon Islands" },
    { "code": "SC", "name": "Seychelles" },
    { "code": "SD", "name": "Sudan" },
    { "code": "SE", "name": "Sweden" },
    { "code": "SG", "name": "Singapore" },
    { "code": "SH", "name": "Saint Helena, Ascension and Tristan da Cunha" },
    { "code": "SI", "name": "Slovenia" },
    { "code": "SJ", "name": "Svalbard and Jan Mayen" },
    { "code": "SK", "name": "Slovakia" },
    { "code": "SL", "name": "Sierra Leone" },
    { "code": "SM", "name": "San Marino" },
    { "code": "SN", "name": "Senegal" },
    { "code": "SO", "name": "Somalia" },
    { "code": "SR", "name": "Suriname" },
    { "code": "SS", "name": "South Sudan" },
    { "code": "ST", "name": "Sao Tome and Principe" },
    { "code": "SV", "name": "El Salvador" },
    { "code": "SX", "name": "Sint Maarten (Dutch part)" },
    { "code": "SY", "name": "Syrian Arab Republic" },
    { "code": "SZ", "name": "Swaziland" },
    { "code": "TC", "name": "Turks and Caicos Islands" },
    { "code": "TD", "name": "Chad" },
    { "code": "TF", "name": "French Southern Territories" },
    { "code": "TG", "name": "Togo" },
    { "code": "TH", "name": "Thailand" },
    { "code": "TJ", "name": "Tajikistan" },
    { "code": "TK", "name": "Tokelau" },
    { "code": "TL", "name": "Timor-Leste" },
    { "code": "TM", "name": "Turkmenistan" },
    { "code": "TN", "name": "Tunisia" },
    { "code": "TO", "name": "Tonga" },
    { "code": "TR", "name": "Turkey" },
    { "code": "TT", "name": "Trinidad and Tobago" },
    { "code": "TV", "name": "Tuvalu" },
    { "code": "TW", "name": "Taiwan, Province of China" },
    { "code": "TZ", "name": "Tanzania, United Republic of" },
    { "code": "UA", "name": "Ukraine" },
    { "code": "UG", "name": "Uganda" },
    { "code": "UM", "name": "United States Minor Outlying Islands" },
    { "code": "UY", "name": "Uruguay" },
    { "code": "UZ", "name": "Uzbekistan" },
    { "code": "VA", "name": "Holy See" },
    { "code": "VC", "name": "Saint Vincent and the Grenadines" },
    { "code": "VE", "name": "Venezuela (Bolivarian Republic of)" },
    { "code": "VG", "name": "Virgin Islands (British)" },
    { "code": "VI", "name": "Virgin Islands (U.S.)" },
    { "code": "VN", "name": "Viet Nam" },
    { "code": "VU", "name": "Vanuatu" },
    { "code": "WF", "name": "Wallis and Futuna" },
    { "code": "WS", "name": "Samoa" },
    { "code": "YE", "name": "Yemen" },
    { "code": "YT", "name": "Mayotte" },
    { "code": "ZA", "name": "South Africa" },
    { "code": "ZM", "name": "Zambia" },
    { "code": "ZW", "name": "Zimbabwe" }
  ];
  let ProfilePhoto = null;
  if (userData.profilePhoto) {
    ProfilePhoto = `http://localhost:5000/${userData.profilePhoto}`;
  }
  const handleEdit = () => {
    setEditMode(true);
    setEditedData(userData);
  };

  const handleSave = async () => {
    const formData = new FormData();
    // Append all the edited data to the formData
    Object.keys(editedData).forEach((key) => {
      formData.append(key, editedData[key]);
    });

    // Use fetch to send the formData to the server
    await fetch("http://localhost:5000/api/update-profile-freelancer", {
      method: "POST",
      body: formData,
      credentials: 'include',
    })
      .then((response) => response.json())
      .then(async (data) => {
        // Handle success response
        console.log("Profile updated successfully", data);

        await fetchUserData();
        setEditMode(false);
        // Update userData in parent component or make API call to update data
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating profile", error);
      });
  };


  const handleCancel = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setEditedData((prevData) => ({
        ...prevData,
        profilePhoto: files[0], // Assuming only one file is selected
      }));
    } else {
      setEditedData((prevData) => ({
        ...prevData,
        [name]: name === "skills" ? value.split(",") : value,
      }));
    }
  };


  return (
    <div className="container-fluid">
      {step === 1 ? (
        <>
          <div className="row mt-2 pt-3">
            <div className="col-lg-6">
              <div className="list-group list-group-dashboard">
                <button
                  type="button"
                  className={`list-group-item list-group-item-action ${!editMode && "active"
                    }`}
                  onClick={() => setStep(1)}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => setStep(2)}
                >
                  Proposals
                </button>
                <button
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => setStep(3)}
                >
                  Your Jobs
                </button>
              </div>
            </div>
            <div className="col-lg-6 mt-1">
              {!editMode ? (
                <>
                  {/* <h1 className="display-2">Welcome, </h1> */}
                  {ProfilePhoto ? (
                    <img
                      className="img-thumbnail w-25 rounded-circle"
                      src={ProfilePhoto}
                      alt="YOUR MOM"
                    />

                  ) : (
                    <i className="bi bi-person-circle text-success fs-1"></i>
                  )}
                  <div className="row">
                    <div className="col-4">
                      <p className="h4">{userData.fullName}</p>
                    </div>
                    <div className="col-6">
                      <p className="h4"><i className="bi bi-geo-alt text-success"></i> {<CountryName countryCode={userData.country} />}</p>
                    </div>
                  </div>
                  <hr />
                  <p className="text-success">UserType: <b className="text-primary">{userData.userType}</b></p>
                  <p className="text-success">Wallet: <b className="text-primary">${userData.earned}</b><button className="btn btn-success mx-3">Withdraw</button></p>
                  <span className="text-success">Email: </span>
                  <p className="h6"><b>{userData.email}</b></p>
                  <hr />
                  {!userData.skills || userData.skills.length === 0 ? (
                    <p>
                      <em>No skills added. </em>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleEdit}
                      >
                        Add skills
                      </button>
                    </p>
                  ) : (
                    <>
                      <span className="text-success">Skills: </span>
                      <p><b>{userData.skills.join(", ")}</b></p>
                    </>
                  )}

                  {userData.description ? (
                    <>
                      <span className="text-success">Description: </span>
                      <p><b>{userData.description}</b></p>
                    </>
                  ) : (
                    <p>
                      <em>No description added. </em>
                      <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleEdit}
                      >
                        Add description
                      </button>
                    </p>
                  )}
                  <button
                    type="button"
                    className="btn btn-info p-2 m-2"
                    onClick={handleEdit}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <h3>Edit Profile</h3>
                  <label className="m-2"> Profile Photo :</label>
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleChange}
                    className="form-control-file mt-2"
                  />
                  <br />
                  <label className="m-2">Full Name :</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editedData.fullName}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />
                  {/* <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleChange}
                    className="form-control mb-2"
                  /> */}
                  <label className="m-2">Location :</label>
                  {/* <select
                    name="country"
                    value={editedData.country}
                    onChange={handleChange}
                    className="form-control mb-2"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    {/* Add more options as needed *
                  </select> */}

                  <Form.Select aria-label="Select Country" name="country" value={editedData.country} onChange={handleChange}>
                    <option>Select a country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </Form.Select>

                  <label className="m-2">Skills :</label>
                  <input
                    type="text"
                    name="skills"
                    value={editedData.skills ? editedData.skills.join(",") : ""}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder="Add skills"
                  />
                  <label className="m-2"> Description :</label>
                  <textarea
                    name="description"
                    value={editedData.description || ""}
                    onChange={handleChange}
                    className="form-control mb-2"
                    placeholder="Add description"
                  ></textarea>
                  <button
                    type="button"
                    className="btn btn-primary m-2"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary m-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      ) : step === 2 && userData ? (
        <FreelancerProposals userData={userData} Back={() => setStep(1)} />
      ) : step === 3 && userData ? (
        <FreelancerJobs userData={userData} Back={() => setStep(1)} />
      ) : null}
    </div>
  );
};

export default FreelancerDashboard;
