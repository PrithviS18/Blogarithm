const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const bycrypt = require('bcrypt')
const verifytoken = require('../verifytoken')


//CREATE
router.post("/create", async(req,res)=>{
    try{
        const newComment = new Comment(req.body)
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    }catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", async(req,res)=>{
    try{
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
       res.status(200).json(updatedComment)
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id",verifytoken, async(req,res)=>{
    try{
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json("Comment has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//GET comments DETAILS
router.get('/post/:postId',async(req,res)=>{
    try{
        const comment = await Comment.find({postId:req.params.postId})
        res.status(200).json(comment)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router