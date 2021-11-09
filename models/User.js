const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    notes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'notes'
    }],
    pinnedNotes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'notes'
    }],
    date:{
        type:Date,
        default:Date.now
    }
})

const User=mongoose.model("user",UserSchema)
module.exports=User