const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
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
module.exports = profileRouter
