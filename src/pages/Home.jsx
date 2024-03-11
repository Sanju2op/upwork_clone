import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
import "./Home.css";

//images
import MicrosoftSVG from '../images/microsoft.svg';
import AirbnbSVG from '../images/airbnb.svg';
import BissellSVG from '../images/bissell.svg';
import AstaGIF from "../images/searching-talent.jpg";



const Home = () => {
    useEffect(() => {
        document.title = "Upwork | The World's Work Marketplace";
    }, []);
    return (
        <div className="container-fluid">
            <div className="container mt-5 pt-3">
                <div className="row">
                    <div className="col-7">
                        <h1 className="FontStyleHereHome "><span>How Work <br />should work</span></h1>
                        <h4 className="text-muted hero-sub-text"><span>Forget the old rules. You can have the best people.
                            Right now. Right here.</span></h4>
                            <a href='/signup' className='btn btn-success rounded-5 px-4 mt-4 py-2 font-get-started'>Get started</a>
                    </div>
                    <div className="col-5">
                        <img loading="" srcSet="https://res.cloudinary.com/upwork-cloud-acquisition-prod/image/upload/c_scale,w_440,h_300,f_auto,q_auto,dpr_2.0/brontes/hero/searching-talent@1x.png 1x,https://res.cloudinary.com/upwork-cloud-acquisition-prod/image/upload/c_scale,w_440,h_300,f_auto,q_auto,dpr_2.0/brontes/hero/searching-talent@2x.png 2x" src="https://res.cloudinary.com/upwork-cloud-acquisition-prod/image/upload/c_scale,w_440,h_300,f_auto,q_auto,dpr_2.0/brontes/hero/searching-talent@2x.png" width="440" height="300" alt="Global talent illustration" data-qa="hero-image-desktop" className="cld-responsive d-none d-md-block" data-v-3fa42971="" />
                    </div>
                    <div className="col-12 my-5 py-4">
                        <p className='text-muted font-get-started pb-0'>Trusted by</p><br/>
                        <img id="img-width" className='px-lg-3 mx-2' alt="microsoft svg" src={MicrosoftSVG} />
                        <img id="img-width" className='px-lg-3 mx-2' alt="airbnb svg" src={AirbnbSVG} />
                        <img id="img-width" className='px-lg-3 mx-2' alt="bissell svg" src={BissellSVG} />

                    </div>
                </div>
            </div>
            <div className="container my-4 py-3">
                <div className="row">
                <div className="col-5">
                        <img loading="" src={AstaGIF} width="440" height="300" alt="Global talent illustration" data-qa="hero-image-desktop" className="cld-responsive d-none d-md-block" data-v-3fa42971="" />
                    </div>
                    <div className="col-7 px-lg-2">
                        <h1 className='card-titles'>Up your work game, it’s easy</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
