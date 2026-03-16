const mangoose = require('mongoose');

const userschema = new mangoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
    },
    password:{
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        Type: String
    }
});

const User = mangoose.model("User", userschema)
module.exports = User;