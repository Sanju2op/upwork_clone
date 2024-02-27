import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        document.title = "Upwork | The World's Work Marketplace";
      }, []);
    return (
        <div>
            <header>
                <h1 className='alert alert-dark text-primary'>Hello, Bootstrap in react!!</h1>
                <button className='btn btn-danger' type="button">Click Me</button>
                <br/>
                    <Link to='/register'>Register Here</Link>
                    <br />
                    <Link to='/login'>Login Here</Link>
            </header>
        </div>
    )
}

export default Home;

// 