if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const connectToMongo =require('./db')
const express=require('express')
var cors = require('cors')


connectToMongo();

const app=express();
const port=process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// routes here 
app.use('/api/auth',require("./routes/auth"))
app.use('/api/notes',require("./routes/notes"))

app.get('/',(req,res)=>{
    res.send("Working correctly");
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

// backend is working at 

// https://mynotes-backend-nitish.herokuapp.com/