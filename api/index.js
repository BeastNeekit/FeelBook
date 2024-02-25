const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;

const postSchema = new mongoose.Schema({
  content: String,
  userName: String,

});


app.use(cors());

app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017/blogpage")
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("mongodb Error", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", req.params.userName);
    fs.mkdir(uploadPath, { recursive: true })
        .then(() => cb(null, uploadPath))
        .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads", "profile-pictures", req.params.userName);
    fs.mkdir(uploadPath, { recursive: true })
        .then(() => cb(null, uploadPath))
        .catch((err) => cb(err));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});



// Create a model for posts
const Post = mongoose.model("Post", postSchema);
const upload = multer({ storage: storage });
const profilePictureUpload = multer({ storage: profilePictureStorage });
const profilePictures = {};



// Middleware to authenticate requests
app.post("/upload-profile-picture/:userName", profilePictureUpload.single("profilePicture"), (req, res) => {
  const userName = req.params.userName;
  const profilePicture = req.file;

  if (!profilePicture) {
    return res.status(400).json({ error: "No profile picture uploaded" });
  }

  profilePictures[userName] = profilePicture.buffer;

  return res.status(200).json({ message: "Profile picture uploaded successfully" });
});

app.get("/profile-picture/:userName", async (req, res) => {
  const userName = req.params.userName;

  const profilePictureDirectory = path.join(__dirname, "uploads", "profile-pictures", userName);

  try {
    const files = await fs.readdir(profilePictureDirectory);

    // Sort files based on creation time (latest first)
    const sortedFiles = await Promise.all(
        files.map(async (file) => {
          const fullPath = path.join(profilePictureDirectory, file);
          const stats = await fs.stat(fullPath);
          return { file, stats };
        })
    );

    sortedFiles.sort((a, b) => b.stats.ctime.getTime() - a.stats.ctime.getTime());


    const latestProfilePictureFile = sortedFiles.find((file) => /\.(png|jpg|jpeg|gif|bmp|tiff|ico|webp)$/i.test(file.file));

    if (!latestProfilePictureFile) {
      throw new Error("No profile picture found in the directory");
    }

    const profilePicturePath = path.join(profilePictureDirectory, latestProfilePictureFile.file);

    const data = await fs.readFile(profilePicturePath);

    console.log("Latest profile picture found:", profilePicturePath);
    res.writeHead(200, { "Content-Type": "image/" + path.extname(profilePicturePath).substring(1) });
    res.end(data);
  } catch (error) {
    console.error("Error reading profile picture:", error);
    res.status(404).json({ error: "Profile picture not found" });
  }
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    console.log("Attempting login for user:", userName);
    const user = await User.findOne({ userName });

    if (!user) {
      console.log("User not found");
      throw new Error("User not found");
    }
    console.log("Comparing passwords...");
    // Compare the provided password with the stored password in the database
    if (password !== user.password) {
      console.log("Incorrect password");
      throw new Error("Incorrect password");
    }
    console.log("Login successful");
    // If everything is correct, send a success response
    res.json({ message: "Login successful"});

  } catch (error) {
    console.log("Login failed:", error.message);
    res.status(401).json({ error: error.message });
  }
});
app.post("/register", async (req, res) => {
  const { userName, password } = req.body;

  // Check if the username already exists
  const existingUser = await User.findOne({ userName });

  if (existingUser) {
    return res.status(400).json({ message: "Username already taken. Please choose a different one." });
  }

  // If the username is not taken, create a new user
  const userDoc = await User.create({ userName, password });
  res.json(userDoc);
});

app.delete("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(deletedPost);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/posts", async (req, res) => {
  try {
    const { content, userName } = req.body;

    const newPost = new Post({
      content,
      userName,
    });

    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user-posts/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;
    const userPosts = await Post.find({ userName });
    res.json(userPosts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/user-posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(deletedPost);
  } catch (error) {
    console.error("Error deleting user post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.post("/upload-photo/:userName", upload.single("photos"), (req, res) => {
  res.status(200).send("Photo uploaded successfully");
});

app.get("/user-photos/:userName", async (req, res) => {
  try {
    const uploadPath = path.join(__dirname, "uploads", req.params.userName);
    const files = await fs.readdir(uploadPath);

    const photos = files.map((file) => ({
      id: file, // You might want to use a better identifier
      url: `http://localhost:4000/uploads/${req.params.userName}/${file}`,
    }));

    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(4000);
