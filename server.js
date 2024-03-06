require('dotenv').config();
const express = require('express'); 
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

//const crypto = require('crypto');
// Generate a random secret key
// const secretKey = crypto.randomBytes(32).toString('hex');

const mongoURI = 'mongodb://localhost:27017/test';
const app = express();
const port = 5000;
//middleware to parse json bodies
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//database Connection
mongoose.connect(mongoURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const sessionStore = new MongoStore({
    mongoUrl: mongoURI, 
    //ttl: 24 * 60 * 60, // Optional session timeout in seconds
    collection:"mySessions"
});

// Middleware to initialize session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    }
}));

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
    req.session.verificationCode = verificationCode;
    req.session.email = email;

    console.log("\n");
    console.log(req.session);
    console.log(req.session.id);
    console.log("\n");
    console.log("Session /api/sendVerificationCode - variables set:", req.session.verificationCode, req.session.email);
    console.log("\n");

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
    console.log(req.session);
    console.log(req.session.id);
    console.log("\n");
    console.log("Session /api/verifyEmail - variables set:", storedEmail, storedVerificationCode);
    console.log("\n");   

     // Check if the verification code is correct
     if (verificationCode !== storedVerificationCode && email !== storedEmail) {
        res.status(400).json({ error: 'Invalid verification code.' });
        return;
    }

    // Clear the verification code from the session
    req.session.verificationCode = null;
    storedVerificationCode = null;

    // Optionally, you can mark the email as verified in your database
    // For example, if you have a User model with an emailVerified field
    // User.findOneAndUpdate({ email }, { emailVerified: true })
    console.log("user logged in ");
    res.status(200).json({ message: 'Email verified successfully.' });
});

app.listen(port, () => {
    console.log(`\n Server Running at http://localhost:${port}`);
});