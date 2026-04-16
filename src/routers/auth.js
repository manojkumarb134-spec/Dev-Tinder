const express = require("express");
const authRouter = express.Router();
const { validateSignUpdata } = require("../utils/validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");


authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpdata(req)
        const data = req.body;
        const password = data.password;
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword
        const user = new User(data);
        const savedUser = await user.save();
        const token = await savedUser.getJWTToken();
        res.cookie("token", token);
        res.json({message: "User signed up successfully!", data: savedUser});

    } catch (err) {
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user");
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send({message: "User not found"});
        }
        const isMatch = await user.validatePassword(password);
        if (!isMatch) {
            return res.status(401).send("Invalid password");
        }
        const token = await user.getJWTToken();
        res.cookie("token", token);
        res.send(user);

    } catch (err) {
        console.error("Error logging in", err);
        res.status(400).send("Error:" + err.message);
    }

});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { 
        expires: new Date(Date.now())
     });
    res.send("Logout Successfull")
});


module.exports = authRouter;


