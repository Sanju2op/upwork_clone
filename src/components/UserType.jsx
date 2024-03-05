import React from "react";
import './Usertype.css';

const UserType = ({ userType, setUserType, handleContinue }) => {
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    return (
        <div className="container-fluid">
            {/* <div className='navbar-brand brand-logo'>
                <a href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 28" role="img" aria-hidden="true"><path fill="#14a800" d="M28.18,19.06A6.54,6.54,0,0,1,23,16c.67-5.34,2.62-7,5.2-7s4.54,2,4.54,5-2,5-4.54,5m0-13.34a7.77,7.77,0,0,0-7.9,6.08,26,26,0,0,1-1.93-5.62H12v7.9c0,2.87-1.3,5-3.85,5s-4-2.12-4-5l0-7.9H.49v7.9A8.61,8.61,0,0,0,2.6,20a7.27,7.27,0,0,0,5.54,2.35c4.41,0,7.5-3.39,7.5-8.24V8.77a25.87,25.87,0,0,0,3.66,8.05L17.34,28h3.72l1.29-7.92a11,11,0,0,0,1.36,1,8.32,8.32,0,0,0,4.14,1.28h.34A8.1,8.1,0,0,0,36.37,14a8.12,8.12,0,0,0-8.19-8.31"></path><path fill="#14a800" d="M80.8,7.86V6.18H77.2V21.81h3.65V15.69c0-3.77.34-6.48,5.4-6.13V6c-2.36-.18-4.2.31-5.45,1.87"></path><polygon fill="#14a800" points="55.51 6.17 52.87 17.11 50.05 6.17 45.41 6.17 42.59 17.11 39.95 6.17 36.26 6.17 40.31 21.82 44.69 21.82 47.73 10.71 50.74 21.82 55.12 21.82 59.4 6.17 55.51 6.17"></polygon><path fill="#14a800" d="M67.42,19.07c-2.59,0-4.53-2.05-4.53-5s2-5,4.53-5S72,11,72,14s-2,5-4.54,5m0-13.35A8.1,8.1,0,0,0,59.25,14,8.18,8.18,0,1,0,75.6,14a8.11,8.11,0,0,0-8.18-8.31"></path><path fill="#14a800" d="M91.47,14.13h.84l5.09,7.69h4.11l-5.85-8.53a7.66,7.66,0,0,0,4.74-7.11H96.77c0,3.37-2.66,4.65-5.3,4.65V0H87.82V21.82h3.64Z"></path></svg>
                </a>
            </div> */}
            <div id="container">
                <div>
                    <div className="row m-5">
                        <div className="col">
                            <h1 className="FontStyleHere">Join as a client or freelancer</h1>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col">
                            <label>
                                <div className="card m-2 border-3 ">
                                    <div className="card-body">
                                        <input
                                            type="radio"
                                            value="client"
                                            checked={userType === "client"}
                                            onChange={handleUserTypeChange}
                                        />
                                        <h5 id="typeLogo" className="card-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-name="Layer 1" viewBox="0 0 24 24" role="img"><path fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.28 21h-6.9a1.6 1.6 0 01-1.73-1.5v-4a1.6 1.6 0 011.73-1.5h6.9A1.59 1.59 0 0121 15.5v4a1.66 1.66 0 01-1.72 1.5z"></path><path fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.9 12h-2.15a.65.65 0 00-.72.66V14h3.59v-1.34a.65.65 0 00-.72-.66z"></path><line x1="10.65" x2="21" y1="17.29" y2="17.29" fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><circle cx="10.04" cy="5.73" r="2.73" fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 18.45v-.9a7 7 0 017-7h.09a6.73 6.73 0 011.91.27"></path></svg>
                                        </h5>
                                        <h3 className="card-subtitle text-dark">I’m a client, hiring for a project &nbsp;&nbsp;</h3>
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="col">
                            <label>
                                <div className="card m-2 border-3 ">
                                    <div className="card-body">
                                        <input
                                            type="radio"
                                            value="freelancer"
                                            checked={userType === "freelancer"}
                                            onChange={handleUserTypeChange}
                                        />
                                        <h5 id="typeLogo" className="card-title">
                                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-name="Layer 1" viewBox="0 0 24 24" role="img"><polygon fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" points="19.38 21 8.38 21 10 14 21 14 19.38 21"></polygon><circle cx="14.69" cy="17.5" r=".5" fill="var(--icon-color, #001e00)" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round"></circle><line x1="9.43" x2="5.99" y1="21" y2="21" fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line><circle cx="10.04" cy="5.73" r="2.73" fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle><path fill="none" vector-effect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 18.45v-.9a7 7 0 017-7h.09a6.94 6.94 0 013.79 1.12"></path></svg>
                                        </h5>
                                        <h3 className="card-subtitle text-dark"> I’m a freelancer, looking for work</h3>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col">
                            <button className="btn btn-success rounded-5 px-4" onClick={handleContinue} disabled={userType === ""}>{userType === "" ? "Create Account" : userType === "client" ? "Join as a Client" : "Apply as a Freelancer"}</button><br />
                            <div className="p-3">Already have an account? <a id="linkStuff" href="/login">Log In</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserType;
