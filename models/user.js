const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/postproject");

const userSchema = mongoose.Schema({
    name : String,
    username : String,
    age : Number,
    password : String,
    email : String,
    profilepic :{
        type : String,
        default : "default.png"
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;