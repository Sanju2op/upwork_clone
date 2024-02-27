import React from 'react'
import { Link } from 'react-router-dom'
const Home = () => {
    return (
        <div>
             <Link to='/register'>Register Here</Link>
             <br/>
            <Link to='/login'>Login Here</Link>
        </div>
    )
}

export default Home;