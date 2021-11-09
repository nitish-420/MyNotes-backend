const express=require('express')
const router=express.Router()
const {body,validationResult}=require('express-validator')
const fetchuser=require("../middleware/fetchUser")
const Note=require('../models/Note')
const User = require('../models/User')

// Route 1 to get all the notes 
router.get("/fetchallnotes",fetchuser,async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).populate("notes")
        const notes=user.notes
        // console.log(notes)
        res.json(notes)

    }catch(error){
        console.error(error.message);
        res.status(500).send("Inter Server error occured");
    }
})
// 1.1 to get all pinned notes
router.get("/fetchpinnednotes",fetchuser,async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).populate("pinnedNotes")
        const notes=user.pinnedNotes
        // console.log(notes)
        res.json(notes)

    }catch(error){
        console.error(error.message);
        res.status(500).send("Inter Server error occured");
    }
})

// Route 2 to add a new note 
router.post("/addnote",[
    body('title','Enter a valid title').isLength({min:1}),
    body('description','Description must be atleast 5 characters').isLength({min:1})//this all are express validators
],fetchuser,async (req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json(errors)
        }
        const {title,description,tag,pinned,archived}=req.body;
    
        const note=new Note({
            title,description,tag,user:req.user.id,
            date:new Date().toLocaleString()
        })

        const savedNote=await note.save()
        await User.findByIdAndUpdate(req.user.id,{$push:{notes:savedNote._id}})
        res.json(savedNote)

    }catch(error){
        // console.error(error.message);
        res.status(500).send("Inter Server error occured");
    }
})

// Route 3 update an existing note
router.put("/updatenote/:id",fetchuser,async (req,res)=>{
    try{
        const {title,description,tag,archived,pinned,date}=req.body;

        const newNote={};
        if(title){
            newNote.title=title;
        }
        if(description){
            newNote.description=description;
        }
        if(tag){
            newNote.tag=tag;
        }
        newNote.archived=archived;
        newNote.pinned=pinned;
        newNote.date=date;
        
        // find the  note to be updated and update it
        
        let note=await Note.findById(req.params.id)
        if(!note){
            res.status(404).send("Not found")
        }
        if(note.user.toString()!==req.user.id){
            res.status(401).send("Not Allowed")
            
        }
        note=await Note.findByIdAndUpdate(req.params.id,{ $set :newNote},{new:true})
        res.json({note})

    }catch(error){
        // console.error(error.message);
        res.status(500).send("Inter Server error occured ");
    }
})

// Route 3.1 update pinning in note
router.put("/updatepinnednote/:id",fetchuser,async (req,res)=>{
    try{
        const {pinned}=req.body;

        const newNote={};
        newNote.pinned=pinned;
        
        // find the  note to be updated and update it
        
        let note=await Note.findById(req.params.id)
        if(!note){
            res.status(404).send("Not found")
        }
        if(note.user.toString()!==req.user.id){
            res.status(401).send("Not Allowed")
            
        }
        note=await Note.findByIdAndUpdate(req.params.id,{ $set :newNote},{new:true})
        if(pinned){
            
            await User.findByIdAndUpdate(req.user.id,{$pull:{notes:note.id},$push:{pinnedNotes:note.id}})
        }
        else{
            await User.findByIdAndUpdate(req.user.id,{$pull:{pinnedNotes:note.id},$push:{notes:note.id}})
        }
        res.json({note})

    }catch(error){
        // console.error(error.message);
        res.status(500).send("Inter Server error occured ");
    }
})


// Route 4 delete  existing note
router.delete("/deletenote/:id",fetchuser,async (req,res)=>{
    try{
        // find the  note to be deleted and delete it
        let success=false;
        
        let note=await Note.findById(req.params.id)
        if(!note){
            res.status(404).json({success})
        }
        if(note.user.toString()!==req.user.id){
            res.status(401).json({success})
            
        }
        note=await Note.findByIdAndDelete(req.params.id)
        await User.findByIdAndUpdate(req.user.id,{$pull:{notes:req.params.id}})
        success=true
        res.json({success,note:note})

    }catch(error){
        // console.error(error.message);
        let success=false
        res.status(500).json({success});
    }
})


module.exports=router