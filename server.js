require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");

// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
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
  // Additional fields
  earned: { type: Number, default: 0 }, // For freelancers
  spent: { type: Number, default: 0 }, // For clients
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

app.post("/api/withdraw", async (req, res) => {
  const { amount, email } = req.body;
  // const { userEmail } = req.user; // Assuming you have a user object with the freelancer's email

  try {
    // Find the user by email and deduct the earned field with the amount
    const user = await User.findOneAndUpdate(
      { email: email },
      { $inc: { earned: -amount } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send an email to the freelancer
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: email,
      subject: "Withdrawal Confirmation",
      text: `Dear Freelancer, you have successfully withdrawn $${amount}.`,
    };

    await transporter.sendMail(mailOptions);

    // Send a response indicating success
    res.status(200).json({ message: "Withdrawal successful" });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ message: "Failed to process withdrawal" });
  }
});

// Categories

// Skill schema
const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

// Subcategory schema
const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: [skillSchema],
});

// Category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [subcategorySchema],
});

// Model for the entire category collection
const Category = mongoose.model("Category", categorySchema);

app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get skills
app.get("/api/skills", async (req, res) => {
  const { subcategory } = req.query;
  if (!subcategory) {
    return res.status(400).json({ error: "Subcategory is required" });
  }

  try {
    const category = await Category.findOne({
      "subcategories.name": subcategory,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const subcategoryObj = category.subcategories.find(
      (sub) => sub.name === subcategory
    );
    if (!subcategoryObj) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    const skills = subcategoryObj.skills.map((skill) => skill.name);
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API endpoint for adding a skill to a subcategory
app.post(
  "/api/categories/:categoryId/subcategories/:subcategoryId/skills",
  async (req, res) => {
    const { categoryId, subcategoryId } = req.params;
    const { name } = req.body;

    try {
      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Find the subcategory by its ID in the category's subcategories array
      const subcategory = category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res
          .status(404)
          .json({ message: "Subcategory not found in the category" });
      }

      // Create a new skill
      const newSkill = { name };
      subcategory.skills.push(newSkill);
      await category.save();

      res.status(200).json({ message: "Skill added successfully", category });
    } catch (error) {
      console.error("Error adding skill:", error);
      res.status(500).json({ message: "Failed to add skill" });
    }
  }
);

// Delete Skill
app.delete(
  "/api/categories/:categoryId/subcategories/:subcategoryId/skills/:skillId",
  async (req, res) => {
    const { categoryId, subcategoryId, skillId } = req.params;

    try {
      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Find the subcategory by its ID in the category's subcategories array
      const subcategory = category.subcategories.id(subcategoryId);
      if (!subcategory) {
        return res
          .status(404)
          .json({ message: "Subcategory not found in the category" });
      }

      // Find the skill index
      const skillIndex = subcategory.skills.findIndex(
        (skill) => skill._id.toString() === skillId
      );
      if (skillIndex === -1) {
        return res
          .status(404)
          .json({ message: "Skill not found in the subcategory" });
      }

      // Remove the skill from the subcategory
      subcategory.skills.splice(skillIndex, 1);
      await category.save();

      // Return the updated category with populated subcategories and skills
      const updatedCategory = await Category.findById(categoryId).populate({
        path: "subcategories",
        populate: { path: "skills" },
      });

      res.status(200).json({ categories: updatedCategory });
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  }
);

// POST endpoint to add a subcategory to a category
app.post("/api/categories/:categoryId/subcategories", async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Add the new subcategory to the category's subcategories array
    category.subcategories.push({ name });

    // Save the updated category
    await category.save();

    // Return the updated category
    res.status(201).json({ category });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ message: "Failed to add subcategory" });
  }
});

// DELETE endpoint to delete a subcategory from a category
app.delete(
  "/api/categories/:categoryId/subcategories/:subcategoryId",
  async (req, res) => {
    const { categoryId, subcategoryId } = req.params;

    try {
      // Find the category by ID
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Find the index of the subcategory within the category
      const subcategoryIndex = category.subcategories.findIndex(
        (subcat) => subcat._id.toString() === subcategoryId
      );
      if (subcategoryIndex === -1) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      // Remove the subcategory from the category's subcategories array
      category.subcategories.splice(subcategoryIndex, 1);

      // Save the updated category
      await category.save();

      // Return the updated category
      res
        .status(200)
        .json({ message: "Subcategory deleted successfully", category });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  }
);

// DELETE endpoint to delete a category and its subcategories
app.delete("/api/categories/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove the category
    await Category.findByIdAndDelete(categoryId);

    // Return success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// POST endpoint to add a new category
app.post("/api/categories", async (req, res) => {
  const { name } = req.body;

  try {
    // Create a new category
    const newCategory = new Category({ name });
    await newCategory.save();

    // Return the newly created category
    res.status(201).json({ category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
});

// const categoriesData = [
//   {
//     name: "Development & IT",
//     subcategories: [
//       {
//         name: "Web Development",
//         skills: [
//           { name: "HTML/CSS" },
//           { name: "JavaScript" },
//           { name: "React" },
//         ],
//       },
//       {
//         name: "Mobile Development",
//         skills: [
//           { name: "Android" },
//           { name: "iOS" },
//           { name: "React Native" },
//         ],
//       },
//       {
//         name: "Database Administration",
//         skills: [{ name: "SQL" }, { name: "MongoDB" }, { name: "PostgreSQL" }],
//       },
//     ],
//   },
//   {
//     name: "AI Services",
//     subcategories: [
//       {
//         name: "Machine Learning",
//         skills: [
//           { name: "Python" },
//           { name: "TensorFlow" },
//           { name: "Scikit-learn" },
//         ],
//       },
//       {
//         name: "Natural Language Processing",
//         skills: [{ name: "NLTK" }, { name: "SpaCy" }, { name: "Gensim" }],
//       },
//       {
//         name: "Computer Vision",
//         skills: [
//           { name: "OpenCV" },
//           { name: "TensorFlow" },
//           { name: "PyTorch" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Design & Creative",
//     subcategories: [
//       {
//         name: "Graphic Design",
//         skills: [
//           { name: "Adobe Photoshop" },
//           { name: "Adobe Illustrator" },
//           { name: "Logo Design" },
//         ],
//       },
//       {
//         name: "UI/UX Design",
//         skills: [{ name: "Adobe XD" }, { name: "Figma" }, { name: "Sketch" }],
//       },
//     ],
//   },
//   {
//     name: "Sales & Marketing",
//     subcategories: [
//       {
//         name: "Digital Marketing",
//         skills: [
//           { name: "SEO" },
//           { name: "Social Media Marketing" },
//           { name: "Email Marketing" },
//         ],
//       },
//       {
//         name: "Sales Management",
//         skills: [
//           { name: "Sales Strategy" },
//           { name: "Customer Relationship Management (CRM)" },
//           { name: "Negotiation" },
//         ],
//       },
//     ],
//   },
//   {
//     name: "Admin & Customer Support",
//     subcategories: [
//       {
//         name: "Virtual Assistance",
//         skills: [
//           { name: "Administrative Support" },
//           { name: "Email Handling" },
//           { name: "Calendar Management" },
//         ],
//       },
//       {
//         name: "Customer Support",
//         skills: [
//           { name: "Customer Service" },
//           { name: "Helpdesk Support" },
//           { name: "Live Chat Support" },
//         ],
//       },
//     ],
//   },
// ];

// Category.insertMany(categoriesData)
//   .then((categories) => {
//     console.log("Categories inserted:", categories);
//   })
//   .catch((err) => {
//     console.error("Error inserting categories:", err);
//   });

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
    subject: "Upwork-clone - One Time Email Verification Code",
    text: `<h1>Your verification code is: <strong>${verificationCode}</strong></h1>`,
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
  category: {
    type: String,
    required: true,
  },
  subcategory: {
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

//Revenue Schema
const revenueSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});
const Revenue = mongoose.model("Revenue", revenueSchema);

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
      category,
      subcategory,
      createdAt,
    } = req.body;
    const job = new Job({
      userId,
      title,
      description,
      skillsRequired,
      budget,
      duration,
      category,
      subcategory,
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
  const clientId = req.session.userId;
  const freelancerEmail = req.params.email;

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

    const transactionAmount = updatedProposal.rate; // Example transaction amount
    const flatFee = 4; // Flat fee for transactions less than $25
    const percentageFee = 0.09; // 9% of the transaction amount

    // Calculate the total fee
    let totalFee;
    if (transactionAmount < 25) {
      totalFee = Math.max(flatFee, transactionAmount);
    } else {
      totalFee = transactionAmount * percentageFee;
    }

    // Update the client's spent
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).send("Client not found");
    }
    client.spent = (client.spent || 0) + transactionAmount;
    await client.save();

    // Update the freelancer's earned
    const freelancer = await User.findOne({ email: freelancerEmail });
    if (!freelancer) {
      return res.status(404).send("Freelancer not found");
    }
    freelancer.earned = (freelancer.earned || 0) + transactionAmount - totalFee;
    await freelancer.save();

    // Revenue
    const revenue = new Revenue({
      date: new Date(), // Assuming today's date for simplicity, you can use any date you want
      amount: totalFee,
    });

    // Save the revenue document to the database
    await revenue.save();

    // Calculate amount after fees
    const amountAfterFees = updatedProposal.rate - totalFee;

    // Send an email to the freelancer
    const mailOptions = {
      from: "sanjaylagaria79901@gmail.com",
      to: freelancerEmail,
      subject: "Job completion confirmation",
      text: `Dear Freelancer, your client has marked the job "${updatedJob.title}" as completed. \n\n Please check your bank or wallet for your payment of $${amountAfterFees} after service charges. \n\n Total T&C Applied : $${totalFee} for you job.\n\n Upwork-clone Thank You.`,
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
      text: `Dear Freelancer, your client has requested a revision for the job "${updatedJob.title}". Please revise the work and resubmit it for approval.\n\nTeam Upwork-clone Thank You.`,
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

// Endpoint for Rejecting a proposal
app.put("/api/proposals/:id/reject", async (req, res) => {
  const proposalId = req.params.id;

  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status: "rejected" },
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
      subject: "🚫 Your proposal has been Rejected",
      text: `We are Sorry but  Your proposal for the job "${updatedProposal.jobId.title}" has been Rejected.`,
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
      text: `Dear ${clientName},\n\nCongratulations! we are glad that you found freelancer ${freelancerName} for the job "${jobTitle}".\n\nContract Details:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\nFreelancer Name: ${freelancerName}\nAgreed Price: $${agreedPrice}\n\nPlease review the contract details and let us know if everything looks correct. Once both parties agree, the contract will be considered finalized.\n\nThank you,\n Upwork-Clone`,
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
      text: `Dear ${freelancerName},\n\nCongratulations! Your proposal for the job "${jobTitle}" has been accepted by the client "${clientName}" .\n\nContract Details:\nJob Title: ${jobTitle}\nJob Description: ${jobDescription}\nClient Name: ${clientName}\nAgreed Price: $${agreedPrice}\n\nPlease review the contract details and let us know if everything looks correct. Once both parties agree, the contract will be considered finalized.\n\nThank you,\n Upwork-Clone`,
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

//Admin Processes

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    required: true,
  },
  logs: [
    {
      loginDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Admin = mongoose.model("Admin", adminSchema);

// POST route for admin login
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find admin by username
    const admin = await Admin.findOneAndUpdate(
      { username, password },
      { $push: { logs: { loginDate: new Date() } } },
      { new: true }
    ).exec();
    if (admin) {
      // Set session data for admin
      req.session.adminId = admin._id;
      req.session.isAdmin = true;
      req.session.adminType = admin.isSuperAdmin;
      req.session.save();
      res.status(200).json({ message: "Admin logged in successfully" });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/admin", async (req, res) => {
  try {
    // Check if session is available and isAdmin is true
    if (req.session && req.session.isAdmin) {
      const admin = await Admin.findOne({ _id: req.session.adminId }).exec();
      if (admin) {
        // console.log("Admin", admin.username, "requested session data");
        res.status(200).json({ admin });
        return;
      }
    }
    console.log("Admin is unauthorized");
    res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Generic error for client
  }
});

// a route to fetch all users' data
app.get("/api/admin/users", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.json(users); // Send the users as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// a route to fetch all jobs data
app.get("/api/admin/jobs", async (req, res) => {
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();
    res.json(jobs); // Send the jobs as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// a route to fetch all proposals' data
app.get("/api/admin/proposals", async (req, res) => {
  try {
    // Fetch all proposals from the database and populate the referenced fields
    const proposals = await Proposal.find()
      .populate({
        path: "freelancerId",
        select: "fullName email country", // Select only the fields you need
      })
      .populate({
        path: "jobId",
        select: "title", // Select only the fields you need
      })
      .exec();

    res.json(proposals); // Send the proposals as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Matrices  for app performance
async function calculateRevenue(startDate, endDate) {
  // Assuming revenue is stored in a collection or calculated based on other data
  const revenueData = await Revenue.find({
    date: { $gte: startDate, $lt: endDate },
  });

  // Calculate total revenue from the revenueData
  const totalRevenue = revenueData.reduce(
    (total, revenue) => total + revenue.amount,
    0
  );

  return totalRevenue;
}

// Route to fetch metrics for a specific date range
app.get("/api/admin/metrics", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const startOfDay = new Date(startDate);
    const endOfDay = new Date(endDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const newSignups = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const newProposals = await Proposal.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const newJobs = await Job.countDocuments({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    // Assuming revenue is stored in a collection or calculated based on other data
    const revenue = await calculateRevenue(startOfDay, endOfDay);

    res.json({ newSignups, newProposals, newJobs, revenue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define the endpoint for editing user data
app.put("/api/admin/EditUser", async (req, res) => {
  try {
    // Assuming you are passing the user ID in the request body
    const { userId, fullName, email, userType, country, password } = req.body;
    console.log(userId, fullName, email, userType, country, password);

    // Find the user by ID and update their data
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        fullName,
        email,
        userType,
        country,
        password, // You may want to hash the password before saving it to the database
      },
      { new: true }
    );

    // Respond with the updated user data
    console.log(updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete user admin
app.delete("/api/admin/user/:userId/delete", async (req, res) => {
  try {
    const userId = req.params.userId;

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete Jobs admin
app.delete("/api/admin/job/:jobId/delete", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Assuming you have a Job model and you use it to delete the job
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Proposal by ID
app.delete("/api/admin/proposal/:proposalId/delete", async (req, res) => {
  try {
    const proposalId = req.params.proposalId;

    // Assuming you have a Proposal model and you use it to delete the proposal
    await Proposal.findByIdAndDelete(proposalId);

    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`\n Server Running at http://localhost:${port}`);
});
