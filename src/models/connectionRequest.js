const mangoose = require("mongoose");

const connectionRequeSchema = new mangoose.Schema({
    fromUserId: {
        type: mangoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mangoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }

    }
},
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields to the schema 
    });
connectionRequeSchema.index({fromUserId: 1, toUserId: 1});

connectionRequeSchema.pre("save", async function () {
    const connectionRequest = this;
    // check if the fromUserId is same as toUserId 
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
});

const ConnectionRequestModel = mangoose.model("ConnectionRequest", connectionRequeSchema);
module.exports = ConnectionRequestModel;