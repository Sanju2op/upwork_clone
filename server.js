const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

//database Connection
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//user data Schema
const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

//model for user data
const User = mongoose.model('User', userSchema);

//middleware to parse json bodies
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

//api endpoint to handle user registration
app.post('/api/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        //check if the username already exists
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).json({message:'Username Already exists'});
        }
        
        //create  a new use if username is unique
        const newUser = new User({username, password});
        await newUser.save();
        res.json({message:'User Registered Successfully'});
    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});