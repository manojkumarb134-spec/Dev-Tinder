const express = require('express');
const app = express();
app.use("/user", (req, res, next) => {
   // res.send('Hello from the user route!');
    next(); // to pass control to the next middleware function, if we don't call next(), the second callback function will never be executed.
},(req, res, next)=>{
    console.log('This is the second callback function for the /user route');
   // it will throw an error because we have already sent a response in the first callback function, so we cannot send another response in the second callback function.
  // res.send('This is the second callback function for the /user route');
  next();
}, (req, res)=>{
    console.log('This is the third callback function for the /user route');
    res.send('This is the third callback function for the /user route');
}, 
// (req, res)=>{
//     // it will throw an error because we have already sent a response in the third callback function, so we cannot send another response in the fourth callback function.
//     console.log('This is the fourth callback function for the /user route');
//     res.send('This is the fourth callback function for the /user route');
// }
);
app.listen(3000,()=>{ 
    console.log('Server is running on port 3000');
})