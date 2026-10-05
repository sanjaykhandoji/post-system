const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require("./config/multerconfig");
const path = require('path');

// app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/upload", (req, res) => {
    res.render("uploadprofilepic");
});

app.get("/createpost", isLoggedIn, (req, res) => {
    res.render("createpost");
});

app.post("/upload", isLoggedIn,upload.single("image"),async(req, res) => {
    let user = await userModel.findOne({email : req.user.email});

    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/profile");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("posts");

    res.render("profile", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {

    let post = await postModel.findOne({
        _id: req.params.id
    });

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();

    res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {

    let post = await postModel.findOne({
        _id: req.params.id
    });

    
    res.render("edit",{post});
});

app.post("/update/:id", isLoggedIn, async (req, res) => {

    let post = await postModel.findOneAndUpdate({_id: req.params.id},{content : req.body.content});

    res.redirect("/profile");
});

app.post("/post", isLoggedIn, upload.single("image"), async (req, res) => {

    let user = await userModel.findOne({
        email: req.user.email
    });

    let { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content: content,
        image: req.file ? req.file.filename : null
    });

    user.posts.push(post._id);

    await user.save();

    res.redirect("/profile");
});

app.post("/register", async(req,res) => {
    let {email, password, name, username, age} = req.body;

    let user = await userModel.findOne({email});
    if(user){
        return res.status(409).send("User already exists");
    }

    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(password, salt, async (err,hash) => {
            let user = await userModel.create({
                name,
                username,
                age,
                password : hash,
                email
            });

            // let token = jwt.sign({email : email,userId : user._id},"shhhh");
            // res.cookie("token", token);
            res.redirect("/login");
        });
    });
});

app.post("/login", async (req, res) => {

    let { email, password } = req.body;

    
    let user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).send("User not found");
    }

    bcrypt.compare(password, user.password, function (err, result) {

        if (err) {
            return res.status(500).send("Something went wrong");
        }

        if (result) {

            // Create JWT
            let token = jwt.sign(
                {
                    email: email,
                    userId: user._id
                },
                "shhhh"
            );

            // Store token in cookie
            res.cookie("token", token);

            return res.status(200).redirect("/profile");
        }

        return res.status(401).send("Invalid password");
    });
});

app.get("/logout",(req,res) =>{
    res.cookie("token","");
    res.redirect("/login");
})

function isLoggedIn(req,res,next){
    if(req.cookies.token === ""){
        res.redirect("/login");
    }else{
        let data = jwt.verify(req.cookies.token,"shhhh");
        req.user = data;
    }
    next();
}
app.listen(3000);