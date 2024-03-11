require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = 5000;

//middleware to parse json bodies
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\n --> MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("\n --> Error connecting to MongoDB:", err);
  });

console.log("\n --> mongodb connection string", process.env.MONGO_URI);
const MongoSessionURI = process.env.MONGO_URI;
console.log("\n --> MongoSessionURI connection string", MongoSessionURI, "\n");

// Middleware to initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MongoSessionURI,
      collectionName: "mySessions",
    }),
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    }
  })
);

//Database Insertion for signup
// User schema
const userSchema = new mongoose.Schema({
  userType: String,
  fullName: String,
  email: String,
  password: String,
  country: String,
});

const User = mongoose.model("User", userSchema); // mongodb automatically determines collection name
// const User = mongoose.model('User', userSchema, 'my_custom_collection_name');

// Server side route to handle user sign-up data
app.post("/api/signup", async (req, res) => {
  const { fullName, email, password, country, userType } = req.body;

  // Check if email already exists in the database
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res
      .status(400)
      .json({ error: "Email already exists in the database." });
  }
  // Create a new user with the provided data
  const user = new User({ fullName, email, password, country, userType });

  try {
    // Save the user data to the database
    await user.save();
    console.log("User signed up:", user);
    // Destroy session after signing up
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to destroy session." });
      }
      console.log("Session destroyed");
      res.status(200).json({ message: "User signed up successfully!" });
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    res
      .status(500)
      .json({ error: "Failed to sign up user. Please try again." });
  }
});

//login processes
passport.use(new LocalStrategy(
    { usernameField: 'email' }, // Specify the field for the username
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email, password });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    req.session.userId = req.user._id;
    res.status(200).json({ message: 'Login successful', user: req.user });
  });

  // Server side route to get user data based on session ID
app.get("/api/user", (req, res) => {
  // Check if user is authenticated
  if (req.isAuthenticated()) {
    // User is authenticated, return user data
    res.status(200).json({ user: req.user });
  } else {
    // User is not authenticated, return 401 unauthorized status
    res.status(401).json({ error: "Unauthorized" });
  }
});


// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   // Find user in the database
//   const user = await User.findOne({ email, password });
//   if (user) {
//     // User found, return success response
//     res.status(200).json({ message: "Login successful", user });
//   } else {
//     // User not found or incorrect credentials, return error response
//     res.status(401).json({ message: "Invalid username or password" });
//   }
// });

//Email verification processes
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

// Endpoint to send verification code
app.post("/api/sendVerificationCode", async (req, res) => {
  const { email } = req.body;

  const emailExists = await User.exists({ email });

  if (emailExists) {
    console.log("Email already exists in the database");
    return res
      .status(400)
      .json({ error: "Email already exists in the database." });
  }

  //Generate a random Verification Code
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  //initializing Session Variables
  req.session.verificationCode = verificationCode;
  req.session.email = email;

  console.log("\n Send Verification Code");
  console.log(req.session);
  console.log(req.session.id);
  console.log("\n-------------------------");

  //Send email with verification code
  const mailOptions = {
    from: "sanjaylagaria79901@gmail.com",
    to: email,
    subject: "Upwork - Email Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send verification code." });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Verification code sent successfully." });
    }
  });
});

//Endpoint to verify email with verification code
app.post("/api/verifyEmail", (req, res) => {
  const { email, verificationCodeClient } = req.body;

  console.log("\n VerifyEmail Session");
  console.log(
    req.session.verificationCode,
    " client sent -> ",
    verificationCodeClient
  );
  console.log(req.session.id);
  console.log("\n---------------------------------------");

  if (
    parseInt(verificationCodeClient) !== req.session.verificationCode ||
    email !== req.session.email
  ) {
    res.status(400).json({ error: "Invalid verification code or email." });
    return;
  }

  // Clear the verification code from the session

  console.log("Email Verified");
  res.status(200).json({ message: "Email verified successfully." });
});

app.listen(port, () => {
  console.log(`\n Server Running at http://localhost:${port}`);
});
