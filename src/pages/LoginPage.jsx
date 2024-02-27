import React, { useState } from 'react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(" LoginStuff :", { username, password });
    };
    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Enter Username:</label>
                <br />
                <input type="text" name="username" id="username" value={username} onChange={handleUsernameChange} />
                <br />

                <label htmlFor="password">Enter Password:</label>
                <br />
                <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange} />
                <br />

                <button type="submit">LOGIN</button>
            </form>
        </div>
    )
}
export default LoginPage;
