const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')
const Post = require('./models/Post')
const cors = require('cors')

// database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connection successful")
    } catch (err) {
        console.log("Unsuccessful connection", err)
    }
}
// Post.collection.dropIndex('desc_1', function(err, result) {
//     if (err) {
//       console.log('Error in dropping index: ', err);
//     } else {
//       console.log('Index dropped: ', result);
//     }
// });

//middlewares
dotenv.config()
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'https://soft-starburst-361af9.netlify.app', // Specify the exact origin
    credentials: true, // Allow credentials (cookies, authorization headers)
}));





app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/comment", commentRoute)
app.use("/uploads", express.static("./uploads"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    connectDB()
    console.log("App is running on port 5000")
})


