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
const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to the "uploads" directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage: storage });

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

app.use("/uploads", express.static(__dirname + "/uploads"));

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
  // Freelancer specific fields
  skills: [String],
  description: String,
  // Client specific fields
  companyName: String,
  companyDescription: String,
  // Profile photo path
  profilePhoto: String,
});

const User = mongoose.model("User", userSchema); // mongodb automatically determines collection name
// const User = mongoose.model('User', userSchema, 'my_custom_collection_name');

//edit profile freelancer
app.post(
  "/api/update-profile-freelancer",
  upload.single("profilePhoto"),
  async (req, res) => {
    const { fullName, email, country, skills, description, password } =
      req.body;
    let profilePhotoPath = req.file ? req.file.path : null;

    // Retrieve the existing user from the database
    try {
      const user = await User.findOne({ email, password }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only update the profile photo if a new photo is uploaded
      if (profilePhotoPath === null) {
        profilePhotoPath = user.profilePhoto;
      }

      // Update the user's profile data
      user.fullName = fullName;
      user.email = email;
      user.country = country;
      user.skills = skills;
      user.description = description;
      user.profilePhoto = profilePhotoPath;

      await user.save();
      console.log("User profile updated successfully");

      // Send a success response
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Edit Profile Client
app.post(
  "/api/update-profile-client",
  upload.single("profilePhoto"),
  async (req, res) => {
    const {
      fullName,
      email,
      country,
      companyName,
      companyDescription,
      password,
    } = req.body;
    let profilePhotoPath = req.file ? req.file.path : null;

    // Update the user's profile data in the database
    try {
      const user = await User.findOne({ email, password }).exec();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Only update the profile photo if a new photo is uploaded
      if (profilePhotoPath === null) {
        profilePhotoPath = user.profilePhoto;
      }

      user.fullName = fullName;
      user.email = email;
      user.country = country;
      user.companyName = companyName;
      user.companyDescription = companyDescription;
      user.profilePhoto = profilePhotoPath;

      await user.save();
      console.log("User profile updated successfully");

      // Send a success response
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

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
    enum: [
      "open",
      "closed",
      "pending_completion_confirmation",
      "under_progression",
    ], // Example status values
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
  numberOfProposals: {
    type: Number,
    default: 0, // Default value is 0
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
      numberOfProposals: 0,
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

// Get jobs for a specific user with closed jobs filtered out
app.get("/api/jobs/open", async (req, res) => {
  try {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) {
      return res.status(400).json({ error: "userId parameter is required" });
    }

    const jobs = await Job.find({ userId, status: { $ne: "closed" } });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get all jobs for find work page
app.get("/api/jobs/all", async (req, res) => {
  try {
    // const jobs = await Job.find().populate({
    //   path: "userId",
    //   select: "country",
    // });
    const jobs = await Job.find({ status: { $ne: "closed" } }).populate({
      path: "userId",
      select: "country",
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

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

// Endpoint for the freelancer to mark a job as pending completion confirmation
app.put(
  "/api/jobs/:id/:email/confirm-completion-freelancer",
  async (req, res) => {
    const jobId = req.params.id;

    try {
      const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        {
          status: "pending_completion_confirmation",
          lastUpdated: Date.now(),
        },
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).send("Job not found");
      }

      // Send an email to the client to check their work
      const clientEmail = req.params.email;
      const mailOptions = {
        from: "sanjaylagaria79901@gmail.com",
        to: clientEmail,
        subject: "Job completion confirmation",
        text: `Dear client, your freelancer has marked the job "${updatedJob.title}" as completed. Please check their work.`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);

      res.json(updatedJob);
    } catch (error) {
      console.error("Error updating status of job:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Endpoint for the client to mark a job as complete
app.put("/api/jobs/:id/:email/confirm-completion-client", async (req, res) => {
  const proposalId = req.params.id;

  try {
    // Update the proposal status to "job_completed"
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      {
        status: "job_completed",
      },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).send("Proposal not found");
    }

    // Update the job status to "closed"
    const jobId = updatedProposal.jobId;
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        status: "closed",
        lastUpdated: Date.now(),
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).send("Job not found");
    }

    const serviceFee = updatedProposal.rate * 0.03;
    const amountAfterFees = updatedProposal.rate - serviceFee;
    // Send an email to the client to check their work
    const freelancerEmail = req.params.email;
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: freelancerEmail,
      subject: "Job completion confirmation",
      text: `Dear Freelancer, your client has marked the job "${updatedJob.title}" as completed. \n\n Please check your bank or wallet for your payment of $${amountAfterFees} after service charges. \n\n Total T&C Applied : $${serviceFee} for you job.\n\nTeam Upwork Thank You.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating status of job:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Job revision
app.put("/api/jobs/:id/:email/confirm-completion-revised", async (req, res) => {
  const jobId = req.params.id;

  try {
    // Update the job status to "under_progression"
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        status: "under_progression",
        lastUpdated: Date.now(),
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).send("Job not found");
    }

    // Send an email to the freelancer to revise the work
    const freelancerEmail = req.params.email;
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: freelancerEmail,
      subject: "Job Revision Required",
      text: `Dear Freelancer, your client has requested a revision for the job "${updatedJob.title}". Please revise the work and resubmit it for approval.\n\nTeam Upwork Thank You.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating status of job:", error);
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
const proposalSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["pending", "accepted", "rejected", "withdrawn", "job_completed"],
      default: "pending",
    },
    clientNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

// Endpoint to submit a proposal @proposalsubmit
app.post("/api/submit-proposal", async (req, res) => {
  const { jobId, freelancerId, coverLetter, rate, duration } = req.body;

  try {
    // Find the job to get the clientId
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Create a new proposal
    const proposal = new Proposal({
      jobId,
      freelancerId,
      clientId: job.userId, // Set the clientId to the userId of the job poster
      coverLetter,
      rate,
      duration,
    });

    // Save the proposal to the database
    await proposal.save();

    // Update the numberOfProposals field in the job document
    await Job.findByIdAndUpdate(jobId, { $inc: { numberOfProposals: 1 } });

    // Respond with a success message
    res.status(201).json({ message: "Proposal submitted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error submitting proposal:", error.message);
    res.status(500).json({ message: "Failed to submit proposal" });
  }
});

//proposals request about specific user for freelancer
app.get("/api/proposals", async (req, res) => {
  try {
    const { userId } = req.query;
    const proposals = await Proposal.find({ freelancerId: userId }).populate({
      path: "jobId",
      populate: {
        path: "userId",
        select: "fullName email country",
      },
    });

    res.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error.message);
    res.status(500).json({ message: "Failed to fetch proposals" });
  }
});

// app.get('/api/proposals', async (req, res) => {
//   try {
//     const { userId } = req.query;
//     const proposals = await Proposal.find({ freelancerId: userId })
//       .populate({
//         path: 'jobId',
//         select: 'title duration budget',
//         populate: {
//           path: 'userId',
//           select: 'fullName email country',
//         },
//       });

//     res.json(proposals);
//   } catch (error) {
//     console.error('Error fetching proposals:', error.message);
//     res.status(500).json({ message: 'Failed to fetch proposals' });
//   }
// });

// for client to fetch proposals about specific job
app.get("/api/proposals/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params;
    const proposals = await Proposal.find({ jobId })
      .populate({
        path: "jobId",
        select: "title description budget duration createdAt status",
        populate: {
          path: "userId",
          select: "fullName email country",
        },
      })
      .populate({
        path: "freelancerId",
        select: "fullName email country skills",
      });

    res.json(proposals);
  } catch (error) {
    console.error("Error fetching proposals:", error.message);
    res.status(500).json({ message: "Failed to fetch proposals" });
  }
});

// Endpoint for accepting a proposal
app.put("/api/proposals/:id/accept", async (req, res) => {
  const proposalId = req.params.id;

  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: "accepted" },
      { new: true }
    )
      .populate("freelancerId")
      .populate("jobId"); // Populate the freelancerId and jobId fields

    if (!updatedProposal) {
      return res.status(404).send("Proposal not found");
    }

    // Now updatedProposal.freelancerId and updatedProposal.jobId should contain the full documents
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: updatedProposal.freelancerId.email,
      subject: "Your proposal has been accepted",
      text: `Congratulations! Your proposal for the job "${updatedProposal.jobId.title}" has been accepted.`,
    };

    // Send email notification
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email notification." });
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({ message: "Email notification sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error accepting proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

// contracts Schema
const contractSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  freelancerName: {
    type: String,
    required: true,
  },
  agreedPrice: {
    type: Number,
    required: true,
  },
  // Add more fields as needed
});

const Contract = mongoose.model("Contract", contractSchema);

// Endpoint for creating a contract
app.post("/api/contracts", async (req, res) => {
  const {
    jobId,
    jobTitle,
    jobDescription,
    clientName,
    freelancerName,
    agreedPrice,
    clientEmail,
    freelancerEmail,
  } = req.body;

  try {
    // Create a new contract document
    const contract = new Contract({
      jobId,
      jobTitle,
      jobDescription,
      clientName,
      freelancerName,
      agreedPrice,
      // Add more fields as needed
    });

    // Save the contract to the database
    await contract.save();

    // Send contract details to both client and freelancer
    const clientMailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: clientEmail,
      subject: "Contract Details",
      text: `Dear ${clientName},\n\nCongratulations! we are glad that you found freelancder ${freelancerName} for the job "${jobTitle}".\n\nContract Details:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\nFreelancer Name: ${freelancerName}\nAgreed Price: $${agreedPrice}\n\nPlease review the contract details and let us know if everything looks correct. Once both parties agree, the contract will be considered finalized.\n\nThank you,\nYour Company Name`,
    };
    transporter.sendMail(clientMailOptions, (clientError, clientInfo) => {
      if (clientError) {
        console.error("Error sending client email:", clientError);
      } else {
        console.log("Client email sent:", clientInfo.response);
      }
    });

    const freelancerMailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: freelancerEmail,
      subject: "Contract Details",
      text: `Dear ${freelancerName},\n\nCongratulations! Your proposal for the job "${jobTitle}" has been accepted by the client "${clientName}" .\n\nContract Details:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\nClient Name: ${clientName}\nAgreed Price: $${agreedPrice}\n\nPlease review the contract details and let us know if everything looks correct. Once both parties agree, the contract will be considered finalized.\n\nThank you,\nYour Company Name`,
    };
    transporter.sendMail(
      freelancerMailOptions,
      (freelancerError, freelancerInfo) => {
        if (freelancerError) {
          console.error("Error sending freelancer email:", freelancerError);
        } else {
          console.log("Freelancer email sent:", freelancerInfo.response);
        }
      }
    );

    res
      .status(201)
      .json({ message: "Contract created successfully", contract });
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ error: "Failed to create contract" });
  }
});

// proposal withdrawal
app.put("/api/proposals/:id/withdraw", async (req, res) => {
  const proposalId = req.params.id;

  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      {
        status: "withdrawn",
      },
      { new: true }
    )
      .populate("freelancerId")
      .populate("clientId");

    if (!updatedProposal) {
      return res.status(404).send("Proposal not found");
    }

    // Send email notification to both parties
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: [updatedProposal.freelancerId.email, updatedProposal.clientId.email],
      subject: "Proposal Withdrawn",
      text: `The proposal for the job "${updatedProposal.jobId.title}" has been withdrawn.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email notification." });
      } else {
        console.log("Email sent:", info.response);
        res
          .status(200)
          .json({ message: "Email notification sent successfully." });
      }
    });
  } catch (error) {
    console.error("Error withdrawing proposal:", error);
    res.status(500).send("Internal Server Error");
  }
});

// api endpoint to fetch all freelancers details
// app.get("/api/freelancers", async (req, res) => {
//   try {
//     // Select the fields you want to include
//     const freelancers = await User.find({ userType: "freelancer" }).select(
//       "-password"
//     );

//     res.json({ freelancers });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

app.get("/api/freelancers", async (req, res) => {
  try {
    const freelancers = await User.aggregate([
      // Match documents with userType "freelancer"
      { $match: { userType: "freelancer" } },
      // Lookup proposals collection to count completed proposals for each freelancer
      {
        $lookup: {
          from: "proposals",
          let: { freelancerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$freelancerId", "$$freelancerId"] },
                    { $eq: ["$status", "job_completed"] },
                  ],
                },
              },
            },
          ],
          as: "completedProposals",
        },
      },
      // Project to include necessary fields and count of completed proposals
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          country: 1,
          description: 1,
          skills: 1,
          profilePhoto: 1,
          numberOfCompletedProposals: { $size: "$completedProposals" },
        },
      },
    ]);

    res.json({ freelancers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// handle freelancer contact
app.post("/api/contact-freelancer", async (req, res) => {
  const {
    freelancerFullName,
    freelancerEmail,
    ClientEmail,
    ClientFullName,
    ClientMessage,
  } = req.body;

  const mailOptions = {
    from: "sanjaylagaria79901@gmail.com",
    to: freelancerEmail, // Use the freelancer's email here
    subject: "Request to Contact From Client",
    text: `Hello ${freelancerFullName},\n\nYou have received a message from a ${ClientFullName}:\n\n${ClientMessage}\n\n Client Contact Details :\n\nClient Email : ${ClientEmail}`,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success message
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(port, () => {
  console.log(`\n Server Running at http://localhost:${port}`);
});
