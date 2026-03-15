const adminAuth = (req, res, next) => {
   const token = "xyz123"; 
   const isAuthenticated = token === "xyz123"; // Simulating authentication check
   if(isAuthenticated){
      next(); // If authenticated, proceed to the next middleware or route handler
   } else {
      res.status(401).send("Unauthorized access"); // If not authenticated, send an error response
   }
};

const userAuth = (req, res, next)=>{
   const token = "abc456";
   const isAuthenticated = token === "abc456"; // Simulating authentication check
   if(isAuthenticated){
      next();
   }else{
      res.status(401).send("Unauthorized access");
   }
}

module.exports = {
    adminAuth,
    userAuth
};