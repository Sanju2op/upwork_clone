require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express'); 
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const app = express();
const port = 5000;

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');

//middleware to parse json bodies
app.use(bodyParser.json());

// Middleware to initialize session
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
}));

app.use(cors({
    origin: 'http://localhost:3000'
}));

//database Connection
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//Email verification processes
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
    const {email} = req.body;

    //Generate a random Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    //initializing Session Variables
    req.session.verificationCode = "example email code";
    req.session.email = "example email name";

    console.log("Session /api/sendVerificationCode - variables set:", req.session.verificationCode, req.session.email);


    //Send email with verification code
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

//Endpoint to verify email with verification code
app.post('/api/verifyEmail', (req, res) => {
    const { email, verificationCode } = req.body;
    const storedEmail = req.session.email;
    const storedVerificationCode = req.session.verificationCode;
    
    console.log("\n");
    console.log("Session /api/verifyEmail - variables set:", storedEmail, storedVerificationCode);
    console.log("\n");   
});

app.listen(port, () => {
    console.log(`\n Server Running at http://localhost:${port}`);
});