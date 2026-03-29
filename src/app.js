const express = require('express');
const app = express();
const connetDB = require("./config/database");
const { validateSignUpdata } = require("./utils/validator");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
// Middleware to parse JSON request bodies and cookies from incoming requests 
app.use(express.json());
// cookie parser middleware to parse cookies from incoming requests 
app.use(cookieParser());

app.post('/signUp', async (req, res) => {
    try {
        validateSignUpdata(req);
        // dynamic data from request body 
        const data = req.body;
        const pwd = data.password;
        console.log("Received sign-up data:", pwd);
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(pwd, 10);
        data.password = hashedPassword;
        const user = new User(data);
        await user.save();
        res.send("User signed up successfully!");
    } catch (err) {
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user");
    }
})
app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;
    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(404).send("User not found");
        }
        // Compare the provided password with the hashed password stored in the database
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).send("Invalid password");
        } else {
            const token = await user.getJWTToken();
            res.cookie("token", token);
            res.status(200).send("Login successful");
        }
    }
    catch (err) {
        console.error("Error logging in", err);
        res.status(400).send("Error:" + err.message);
    }
});

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request object
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.send(user); // Send the user profile as the response
    } catch (err) {
        console.error("Error fetching user profile", err);
        res.status(400).send("Error:" + err.message);
    }
})
// Connect to the database and start the server 
connetDB().then(() => {
    console.log("Connected to MongoDB, successfully!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

