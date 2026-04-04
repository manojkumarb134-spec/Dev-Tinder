const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
   try {
      const cookies = req.cookies;
      const { token } = cookies;
      if(!token){
         return res.status(401).send("Unauthorized: No token provided");
      }
      const decoded = await jwt.verify(token, "DevTinderSecretKey");
      const{userId} = decoded;
      const user = await User.findById(userId);
      if(!user){
         return res.status(404).send("User not found");
      }
      req.user = user; // Attach the user object to the request for use in subsequent middleware or route handlers
      next(); // If authenticated, proceed to the next middleware or route handler

   } catch (error) {
      return res.status(401).send("Unauthorized: Invalid token");
   }
   
}

module.exports = {
   userAuth
};