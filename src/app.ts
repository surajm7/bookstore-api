import { config } from "./config/config";
import express, { NextFunction } from "express";
import cors from "cors";
import createHttpError, { HttpError } from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler"
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";



const app =express()
app.use(express.json());
app.use(
    cors({
        origin: config.frontendDomain,
    })
);


//Routes
app.get('/',(req,res,next)=>{
     const error=createHttpError(400,"something went wrong");
    throw error;

    res.json({message:"welcome book store api"})
});

app.use('/api/users',userRouter);
app.use("/api/books", bookRouter);

//global error handler
app.use(globalErrorHandler);
export default app;

// function cors(arg0: { origin: any; }): any {
//     throw new Error("Function not implemented.");
// }

