require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// ... rest of your server code

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');


console.log("\n ");
console.log(secretKey);
console.log("\n");

const app = express();
const port = 5000;

app.use(session({
    secret: secretKey, 
    resave: false,
    saveUninitialized: false
  }));

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
    host: 'smtp.sendgrid.net',
    port: 587,
    secure:false,
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY, 
    },
});

// Endpoint to send verification code
app.post('/api/sendVerificationCode', (req, res) => {
    const { email } = req.body;

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    req.session.verificationCode = verificationCode;
    req.session.email = email;
    
    console.log("\n");
    console.log(req.session.email, req.session.verificationCode);
    console.log("\n");
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

// Endpoint to verify email with verification code
app.post('/api/verifyEmail', (req, res) => {
    
     const { email, verificationCode } = req.body;

    console.log("\n");
    console.log(req.body);
    console.log("\n");
    console.log(email, verificationCode);
    console.log("\n");
    console.log(req.session.verificationCode, req.session.email);
    console.log("\n");

    // Check if the verification code is correct
    if (verificationCode !== req.session.verificationCode && email !== req.session.email) {
        res.status(400).json({ error: 'Invalid verification code.' });
        return;
    }

    // Clear the verification code from the session
    req.session.verificationCode = null;

    // Optionally, you can mark the email as verified in your database
    // For example, if you have a User model with an emailVerified field
    // User.findOneAndUpdate({ email }, { emailVerified: true })

    res.status(200).json({ message: 'Email verified successfully.' });
});


app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});