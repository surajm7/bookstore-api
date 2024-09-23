import express from "express";

const app =express()


//Routes
app.get('/',(req,res,next)=>{
    res.json({message:"welcome book store api"})
})

export default app;

