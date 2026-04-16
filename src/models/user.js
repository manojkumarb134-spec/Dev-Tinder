const mangoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
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
        validate(value) {
            if (!["male", "female", "others"].includes(value.toLowerCase())) {
                throw new Error("Invalid gender value. Allowed values are 'male', 'female', 'others'.");
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY"
    },
    about: {
        type: String,
        default: "Hey there! I'm using DevTinder."
    }
},
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields to the schema 
    }
);

// Hash the password before saving the user document to the database
userschema.methods.getJWTToken = async function () {
    const user = this;
    const token = await jwt.sign({ userId: user._id }, "DevTinderSecretKey",
        { expiresIn: "7d" });
    return token;
}
// Method to compare the provided password with the hashed password stored in the database
userschema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const userPassword = user.password;
    const isMatch = await bcrypt.compare(passwordInputByUser, userPassword);
    return isMatch;

}

const User = mangoose.model("User", userschema)
module.exports = User;