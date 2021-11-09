const mongoose=require("mongoose")

const NotesSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    tag:{
        type:String,
        default:"Self"
    },
    date:String,
    time:{
        type:String,
        default:"never"
    },
    archived:{
        type:Boolean,
        default:false
    },
    pinned:{
        type:Boolean,
        default:false
    }
    
})

module.exports=mongoose.model("notes",NotesSchema)