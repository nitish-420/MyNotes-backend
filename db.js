if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}

const mongoose =require("mongoose")

const dbUrl = process.env.MONGO_ATLAS_URL;


const connectToMongo=()=>{
    try{

        mongoose.connect(dbUrl,{
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
    
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("Database connected");
        });
    }
    catch(error){

        console.log(error)
    }
}


module.exports=connectToMongo;