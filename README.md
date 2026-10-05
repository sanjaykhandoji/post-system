# Mini Social Media Web Application

A simple social media web application built using Node.js, Express.js, MongoDB, Mongoose and EJS.

Users can register and login, create posts with images, upload a profile picture, like posts and edit their posts.

## Features

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Authentication
- Cookie-based Authentication
- User Profile
- Profile Picture Upload
- Create Posts
- Upload Images with Posts
- Display Date and Time for Posts
- Like and Unlike Posts
- Edit Posts
- MongoDB Database
- Responsive UI
- EJS Server-Side Rendering
- Multer for Image Uploads

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- JavaScript
- HTML
- CSS
- bcrypt
- JSON Web Token (JWT)
- Multer
- Cookie Parser

## Project Structure

```text
mini-project-node/
│
├── config/
│   └── multerconfig.js
│
├── models/
│   ├── user.js
│   └── post.js
│
├── public/
│   └── stylesheets/
│       └── common.css
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── edit.ejs
│   └── uploadprofilepic.ejs
│
├── .gitignore
├── app.js
├── package.json
└── package-lock.json
