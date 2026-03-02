const express = require('express');
const app = express();

app.use('/test',(req, res)=>{
    res.send('Hello from the test route!23');
})
app.use('/',(req, res)=>{
    res.send('empty path!!');
})
app.listen(3000,()=>{ // callback function to run when the server starts
    console.log('Server is running on port 3000');
})