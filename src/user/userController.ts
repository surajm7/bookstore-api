import {NextFunction, Request,Response} from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt"
import userModel from "./userModel";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password}=req.body;

    //validation
    if(!name || !email || !password){
        const error=createHttpError(400,"All fields are required")
        return next(error);
    }

    //Database call
    const user=await userModel.findOne({email:email});

    if(user){
        const error=createHttpError(400,"user already exists with this email")
    }

    //password -->hash

    const hashedPassword= await bcrypt.hash(password,10);

    res.json({message:"User created"});
};

export {createUser};