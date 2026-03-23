const mangoose = require('mongoose');

const userschema = new mangoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 30
    },
    lastName: {
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value.toLowerCase())){
                throw new Error("Invalid gender value. Allowed values are 'male', 'female', 'others'.");
            }
        }
    },
    about:{
        type: String,
        default: "Hey there! I'm using DevTinder."
    }
},
{
    timestamps: true // Automatically adds createdAt and updatedAt fields to the schema 
}
);

const User = mangoose.model("User", userschema)
module.exports = User;