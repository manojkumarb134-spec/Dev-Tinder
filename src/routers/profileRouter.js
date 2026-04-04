const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const{validateEditProfileData} = require("../utils/validator")
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req);
        const reqData = req.user; // Access the authenticated user from the request object
        const data = req.body;
        Object.keys(data).forEach((key) => reqData[key] = data[key]);
        const user = new User(reqData);
        await user.save(user);
        res.send(`${reqData.firstName} your profile updated successfully`); // Send the user profile as the response
    } catch (err) {
        res.status(400).send("Error:" + err.message);
    }
})


module.exports = profileRouter
