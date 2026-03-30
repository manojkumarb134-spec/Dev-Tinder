const express = require('express');
const app = express();
const connetDB = require("./config/database");
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profileRouter');
const cookieParser = require("cookie-parser");
// Middleware to parse JSON request bodies and cookies from incoming requests 
app.use(express.json());
// cookie parser middleware to parse cookies from incoming requests 
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
// Connect to the database and start the server 
connetDB().then(() => {
    console.log("Connected to MongoDB, successfully!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

