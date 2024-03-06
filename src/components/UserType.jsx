import React from "react";
import './Usertype.css';

const UserType = ({ userType, setUserType, handleContinue }) => {
    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    return (
        <div className="container-fluid">

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
                            <button
                                className="btn btn-success rounded-5 px-4"
                                onClick={handleContinue}
                                disabled={userType === ""}>{userType === "" ? "Create Account" : userType === "client" ? "Join as a Client" : "Apply as a Freelancer"}
                            </button><br />
                            <div className="p-3">Already have an account? <a id="linkStuff" href="/login">Log In</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserType;
