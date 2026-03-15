const express = require('express');
const app = express();
// order of the routes matters, the first matching route will be executed, so if we put the '/' route before the others, it will always match and the other routes will never be reached. 
// app.use is used to define a route that responds to all HTTP methods (GET, POST, etc.) and can be used for middleware or for defining routes.
// app.use('/test',(req, res)=>{
//     res.send('Hello from the test route!23');
// })
// app.get is used to define a route that responds only to GET requests.
app.get('/user/:userId/:name',(req, res)=>{
    console.log(req.params); // to get the userId from the URL
    res.send({name: 'manoj', age: 30});
});
// app.post is used to define a route that responds only to POST requests.
// app.post('/user',(req, res)=>{
//     res.send('User created successfully!');
// });
// // app.use('/',(req, res)=>{
//     res.send('empty path!!!');
// })

app.listen(3000,()=>{ // callback function to run when the server starts
    console.log('Server is running on port 3000');
})