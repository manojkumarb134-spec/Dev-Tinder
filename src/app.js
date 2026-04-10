const express = require('express');
const cors = require("cors");
const app = express();
const connetDB = require("./config/database");
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profileRouter');
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");
const cookieParser = require("cookie-parser");

// Middleware to parse JSON request bodies and cookies from incoming requests 
app.use(express.json());
// cookie parser middleware to parse cookies from incoming requests 
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
// Connect to the database and start the server 
connetDB().then(() => {
    console.log("Connected to MongoDB, successfully!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

