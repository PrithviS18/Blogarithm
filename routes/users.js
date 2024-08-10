const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const bycrypt = require('bcrypt')
const verifytoken = require('../verifytoken')

//UPDATE
router.put("/:id",verifytoken, async(req,res)=>{
    try{
       const {username,email,password} = req.body
       const user = await User.findById(req.params.id)
       if (user.username!=username)user.username=username
       if (user.email!=email)user.email=email
       const match = await bycrypt.compare(password,user.password);
       if (!match){
        const hashedPass = await bycrypt.hash(password,10)
        user.password=hashedPass
       } 
       const updatedUser = await user.save()
       res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete('/:id',async(req,res)=>{
    try{
        await Post.deleteMany({userId:req.params.id})
        await Comment.deleteMany({userId:req.params.id})
        await User.deleteMany({_id:req.params.id}) 
        res.clearCookie('token').status(200).json("User Deleted")
    }catch(err){

    }
})


//GET USER
router.get('/:id',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        user.password = undefined
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router