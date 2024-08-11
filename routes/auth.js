const express = require('express')
const router = express.Router()
const User  = require("../models/User")
const bycrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifytoken = require('../verifytoken')



//REGISTER
router.post("/register", async(req,res) =>{
    try{
        const {username,email,password} = req.body
        const hashedPass = await bycrypt.hash(password,10)
        const newUser= new User({username,email,password:hashedPass})
        const saveUser = await newUser.save()
        res.status(200).json(saveUser)
    }catch(err){
        res.status(500).json(err)
    }
})

//LOGIN
router.post("/login", async(req,res) =>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if (!user){
            return res.status(404).json("User not found")
        }
        const match = await bycrypt.compare(password,user.password);
        if (!match){
            return res.status(401).json("Wrong credentials")
        }
        const token =jwt.sign({id:user._id,username:user.username,email:user.email},process.env.SECRET_KEY,{expiresIn:"3d"})
        user.password = undefined
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            sameSite: 'None', // Required for cross-site cookies
            maxAge: 3600000 // 1 hour in milliseconds
          }).status(200).json(user);
    }catch(err){
        res.status(500).json(err)
    }
})

//LOGOUT
router.get('/logout',verifytoken,(req,res)=>{
    try{
        res.clearCookie('token', {
            path: '/', // Ensure the path is the same as when the cookie was set
            secure: process.env.NODE_ENV === 'production', // Match the secure flag with the environment
            sameSite: 'None', // Match the sameSite attribute
            httpOnly: true, // Although httpOnly doesn't affect clearing, it should match the initial setting
        }).status(200).json({message:"User logged Out"})
    }catch(err){
        res.status(500).json(err)
    }
})

//REFETCH USER
router.get("/refetch",(req,res)=>{
    const token = req.cookies.token
    jwt.verify(token,process.env.SECRET_KEY,async(err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports = router
