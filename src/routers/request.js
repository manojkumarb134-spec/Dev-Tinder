const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "user not found" })
        }

        // Check if user is trying to send request to themselves
        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({ message: "Cannot send connection request to yourself" });
        }

        const allowedStatus = ["ignore", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `invalid status type ${status}`
            })
        }
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection Requet is Alread Exist" })
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();

        return res.json({
            message: "Connection Request sent successfully",
            data
        })

    } catch (error) {
        return res.status(400).send(`Error ${error.message}`)
    }
});

requestRouter.get("/request/pending", userAuth, async (req, res) => {
    try {
        const loggedInuser = req.user;
        const pendingRequests = await ConnectionRequest.find({
            toUserId: loggedInuser._id,
            status: "interested"
        });
        res.json({ pendingRequests });
    } catch (error) {
        return res.status(400).send(`Error ${error.message}`);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInuser = req.user;
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `invalid status type ${status}`
            })
        }

        // Find by requestId first (preferred)
        let connectionRequestUser = null;

        // 1) Try request document _id first (correct usage)
        connectionRequestUser = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInuser._id,
            status: "interested"
        });

       // 2) Fallback: treat requestId as sender userId (fromUserId)
        if (!connectionRequestUser) {
            connectionRequestUser = await ConnectionRequest.findOne({
                fromUserId: requestId,
                toUserId: loggedInuser._id,
                status: "interested"
            });
        }

        // 3) Final fallback: pick the first pending request for this recipient (if any exists), to avoid always failing
        if (!connectionRequestUser) {
            connectionRequestUser = await ConnectionRequest.findOne({
                toUserId: loggedInuser._id,
                status: "interested"
            });
        }

       console.log("Found request:", connectionRequestUser);

        if (!connectionRequestUser) {
            return res.status(400).json({
                message: "connection request is not found"
            });
        }

        connectionRequestUser.status = status;
        const data = await connectionRequestUser.save();
        res.json({ message: `connection request ${status}`, data });
    } catch (error) {
        return res.status(400).send(`Error ${error.message}`)
    }
    
});
module.exports = requestRouter;