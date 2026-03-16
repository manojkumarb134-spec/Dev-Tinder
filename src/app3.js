const express = require('express');
const {adminAuth, userAuth} = require('./middleware/auth');
const app = express();

app.use("/admin", adminAuth);
app.use("/user", userAuth, (req, res, next) => {
    res.send("Welcome to the user dashboard!");
});
app.get('/admin/dashboard', (req, res) => {
    res.send("Welcome to the admin dashboard!");
});

app.listen(3000,()=>{ 
    console.log('Server is running on port 3000');
});