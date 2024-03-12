require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;

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
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
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

// Login route without Passport.js
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

//login process
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password }).exec();
    if (user) {
      req.session.userId = user._id;
      console.log("user:", user.email, "just logged In");
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//logout process
app.post("/api/logout", (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ error: "Failed to logout" });
      return;
    }
    res.sendStatus(200);
  });
});

// Get user data route without Passport.js
app.get("/api/user", async (req, res) => {
  try {
    // Check if session is available and has userId
    if (req.session && req.session.userId) {
      const user = await User.findOne({ _id: req.session.userId }).exec();
      if (user) {
        console.log("user", user.email, "requested session data");
        res.status(200).json({ user });
        return;
      }
    }
    console.log("User is unauthorized");
    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
});
// passport.use(new LocalStrategy(
//     { usernameField: 'email' }, // Specify the field for the username
//     async (email, password, done) => {
//       try {
//         const user = await User.findOne({ email, password });
//         if (!user) {
//           return done(null, false, { message: 'Incorrect email or password.' });
//         }
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   ));
//   passport.serializeUser((user, done) => {
//     done(null, user.id);
//   });

//   passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//       done(err, user);
//     });
//   });

//   app.use(passport.initialize());
//   app.use(passport.session());

//   app.post('/api/login', passport.authenticate('local'), (req, res) => {
//     req.session.userId = req.user._id;
//     console.log("user:", req.user.email, "just logged In");
//     res.status(200).json({ message: 'Login successful', user: req.user });
//   });

//   // Server side route to get user data based on session ID
// app.get("/api/user", (req, res) => {
//   // Check if user is authenticated
//   if (req.isAuthenticated()) {
//     console.log("user", req.user.email, " Requested session data");
//     res.status(200).json({ user: req.user });
//   } else {
//     // User is not authenticated, return 401 unauthorized status
//     console.log("user", req.user.email, " is unauthorized ");
//     res.status(401).json({ error: "Unauthorized" });
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

//Posting Job
const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed"], // Example status values
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  country: {
    type: String,
    ref: "User.country", // Reference to the country of the User who posted the job
  },
});


const Job = mongoose.model("Job", jobSchema);

//upload jobs
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      skillsRequired,
      budget,
      duration,
      createdAt,
    } = req.body;
    const job = new Job({
      userId,
      title,
      description,
      skillsRequired,
      budget,
      duration,
      createdAt,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// Get jobs for a specific user
app.get("/api/jobs", async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) {
      return res.status(400).json({ error: "userId parameter is required" });
    }

    const jobs = await Job.find({ userId });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get all jobs for find work page
app.get("/api/jobs/all", async (req, res) => {
  try {
    const jobs = await Job.find().populate({
      path: "userId",
      select: "country",
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get all jobs
// app.get("/api/jobs/all", async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.status(200).json(jobs);
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     res.status(500).json({ error: "Failed to fetch jobs" });
//   }
// });


//update jobs
app.put("/api/jobs/:id", async (req, res) => {
  const jobId = req.params.id;
  const { userId, title, description, skillsRequired, budget, duration } =
    req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        userId,
        title,
        description,
        skillsRequired,
        budget,
        duration,
        lastUpdated: Date.now(), // Update the lastUpdated field to the current date and time
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).send("Job not found");
    }

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Status:close for jobs
app.put("/api/jobs/:jobId/close", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    job.status = "closed";
    await job.save();
    res.status(200).json({ message: "Job closed successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete Jobs
app.delete("/api/jobs/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    // Use Mongoose to find and delete the job by ID
    await Job.findByIdAndDelete(jobId);
    res.status(200).send({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).send({ message: "Failed to delete job" });
  }
});

// Proposals processes

//proposal schema
const proposalSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  clientNotes: {
    type: String,
  },
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);

// Endpoint to submit a proposal
app.post('/api/submit-proposal', async (req, res) => {
  const { jobId, freelancerId, coverLetter, rate, duration } = req.body;

  try {
    // Create a new proposal
    const proposal = new Proposal({
      jobId,
      freelancerId,
      coverLetter,
      rate,
      duration,
    });

    // Save the proposal to the database
    await proposal.save();

    // Respond with a success message
    res.status(201).json({ message: 'Proposal submitted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error submitting proposal:', error.message);
    res.status(500).json({ message: 'Failed to submit proposal' });
  }
});


app.listen(port, () => {
  console.log(`\n Server Running at http://localhost:${port}`);
});
