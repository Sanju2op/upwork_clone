import React, { useState } from 'react';

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
         setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        //register Logic 
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            console.log(data);
        } catch(error) {
            console.error(error);
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter Username:</label>
                <br/>
                <input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} />
                <br/>

                <label htmlFor="password">Enter Password:</label>
                <br/>
                <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
                <br/>
                
                <button type="submit">REGISTER</button>
            </form>
        </div>
    );
};
export default RegisterPage;
