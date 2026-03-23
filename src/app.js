const express = require("express");
const app = express();
const connetDB = require("./config/database");
const User = require("./models/user");
// Middleware to parse JSON request bodies
app.use(express.json());
app.post('/signUp', async(req, res)=>{
   
    // Handle sign-up logic here with static data for now  
    // const user = new User({
    //     firstName: "Bonkoori",
    //     lastName: "swetha",
    //     emailId: "swetha134gmail.com",
    //     password: "manoj123"
    // })

    // dynamic data from request body 
     const data = req.body;
    const user = new User(data);

    try {       
         await user.save();
        res.send("User signed up successfully!");
    } catch (err) {
        console.error("Error signing up user", err);
        res.status(500).send("Error signing up user");
    }
})

// Endpoint to fetch user by emailId 
app.get('/user',async(req, res)=>{
    const emailId = req.body.emailId;
  try{
    const users = await User.find({ emailId: emailId });
    res.send(users);
  }catch(err){
    console.error("Error fetching user", err);
    res.status(500).send("Error fetching user");
  }
});

// Endpoint to fetch all users (for testing purposes)
app.get("/feed", async(req, res)=>{
  try{
    const users = await User.find({});
    res.send(users);
  }catch(err){
    console.error("Error fetching user", err);
    res.status(500).send("Error fetching user");
  }
});

// Endpoint to update user details by emailId
app.patch("/user",async(req, res)=>{
    const userId = req.body.userId;
    try{
        const updatedUser = await User.findByIdAndUpdate({_id: userId}, req.body,
             {new: true},{
                runValidators: true,
                returnDocument: "after"
        });
        res.send(updatedUser);
    }catch(err){
        console.error("Error updating user", err);
        res.status(500).send("Error updating user");

    }

})

// Endpoint to delete user by emailId
app.delete("/user", async(req, res)=>{
    const userId = req.body.userId;
    try{
        await User.findByIdAndDelete({_id: userId}, {returnDocument: "after"});
        res.send("User deleted successfully!");
    }catch(err){
        console.error("Error deleting user", err); 
        res.status(500).send("Error deleting user");
    }
});



// Connect to the database and start the server 
connetDB().then(()=>{
    console.log("Connected to MongoDB, successfully!");
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.error("Error connecting to MongoDB", err);
});

