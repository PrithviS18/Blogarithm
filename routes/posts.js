const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const bycrypt = require('bcrypt')
const verifytoken = require('../verifytoken')
const multer = require('multer');
const path = require('path');
  

//img storage path
const imgconfig = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,"./uploads")
    },
    filename: (req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
})

//img filter
const isImage = (req,file,callback)=>{
    if (file.mimetype.startsWith("image")){
        callback(null,true)
    }else {
        callback(new Error("only images is allowed"))
    }

}

const upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})


//CREATE
router.post("/create",  upload.single("photo"), async (req, res) => {
    try {
        // Create a new post with the request body
        const {filename} = req.file

        const {title,desc,username,userId,categories} =req.body

        const newPost = new Post({title,desc,photo:filename,username,userId,categories});

        // Save the post to the database
        const savedPost = await newPost.save();

        // Return the saved post
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id",verifytoken, async(req,res)=>{
    try{
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
       res.status(200).json(updatedPost)
    }catch(err){
        res.status(500).json(err);
    }
})

//DELETE
router.delete("/:id",verifytoken, async(req,res)=>{
    try{
        const id = req.params.id
        await Comment.deleteMany({postId:id})
        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json("Post has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})


//GET POST DETAILS
router.get('/:id',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL POSTS
router.get ("/", async(req,res)=>{
    try{
        const search = req.query.search;
        let query={}
        if (search) {
            const regex = new RegExp(search, 'i'); // 'i' for case-insensitive
            query = { $or: [{ title: regex },{desc:regex},{categories:regex}] };
        }
        const posts = await Post.find(query)
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})

// GET USER POSTS
router.get ("/user/:userId", async(req,res)=>{
    try{
        const posts = await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router