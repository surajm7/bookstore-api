import { config } from "./config/config";
import express, { NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler"
const app =express()


//Routes
app.get('/',(req,res,next)=>{
     const error=createHttpError(400,"something went wrong");
    throw error;

    res.json({message:"welcome book store api"})
});

//global error handler
app.use(globalErrorHandler);
export default app;

