const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
    try {

        const loggedInuser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInuser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about"]);
        res.json({ message: "data fetched successfully", pendingRequests });
    } catch (error) {
        return res.status(400).send(`Error ${error.message}`);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const logginUser = req.user;
        const connectionsData = await ConnectionRequest.find({
            $or: [
                { toUserId: logginUser._id, status: "accepted" },
                { fromUserId: logginUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "gender", "about" ]);

        res.json({ data: connectionsData });

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const logginUser = req.user;
        const pageNum = parseInt(req.params.page) || 1;
        let limit = parseInt(req.params.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (pageNum - 1) * limit;
        // find all connection requests(sent+recieved)
        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: logginUser._id.toString() }, { toUserId: logginUser._id.toString() }]
        }).select({fromUserId: 1, toUserId: 1});
        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId);
            hideUsersFromFeed.add(req.toUserId)
        });
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: logginUser._id } }
            ]
        })
            .select("-password")
            .skip(skip)
            .limit(limit);
        res.send(users);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = userRouter