import express from "express";
const app = express();
const port = process.env.port || 5000;

app.get('/',(req,res)=>{
    res.send("api is working")
})


app.listen(port,(req,res)=>{
    console.log(`Server is running port ${port}`)
})