const validator = require('validator');

const validateSignUpdata =(req)=>{
  const data = req.body;
  const { firstName, lastName, emailId, password} = data;

  if(!firstName || !emailId || !password){
    throw new Error("Missing required fields: firstName, emailId, and password are required.");
  }
  else if(firstName.length < 4 || firstName.length > 30){
    throw new Error("firstName must be between 4 and 30 characters long.");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Invalid email format.");
  }
  else if(validator.isStrongPassword(password)){
    throw new Error("please provide a stronger password. A strong password should be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and symbols."); 
  }
}
module.exports = {
    validateSignUpdata
}