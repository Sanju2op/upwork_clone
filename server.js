const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

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
app.post('/api/signup', async (req, res) => {
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

//mail verification process
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanjaylagaria79901@gmail.com',
        pass: 'M1e2r4a5m6a7n8#3922',
    },
});

app.post('/sendVerificationCode', (req, res) => {
    const { email } = req.body;

    // Generate a random verification code (you can use a library for this)
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Send email with verification code
    const mailOptions = {
        from: 'sanjaylagaria79901@gmail.com',
        to: email,
        subject: 'Upwork - Email Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send verification code.' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Verification code sent successfully.' });
        }
    });
});



app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});