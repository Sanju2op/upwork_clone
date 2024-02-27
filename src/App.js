import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Home from './components/Home'

const App = () => {
  return (
    <Router>  
      <Routes>
        <Route exact path="/" Component={Home}/>
        <Route path="/register" Component={RegisterPage}/>
        <Route path="/login" Component={LoginPage}/>
      </Routes>
    </Router>
  )
}
export default App;
