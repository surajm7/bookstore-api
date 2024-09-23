import {NextFunction, Request,Response} from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt"
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser = async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password}=req.body;

    //validation
    if(!name || !email || !password){
        const error=createHttpError(400,"All fields are required")
        return next(error);
    }

    //Database call
    try {
        
        const user=await userModel.findOne({email:email});
        if(user){
            const error=createHttpError(400,"user already exists with this email")
        }
    } catch (error) {
        return next(createHttpError(500,"Error while getting user"))
    }


    //password -->hash
    let newUser: User;
    try {
        
        const hashedPassword= await bcrypt.hash(password,10);
    
         newUser =await userModel.create({
            name,
            email,
            password:hashedPassword
        })
    } catch (error) {
        return next(createHttpError(500," user already existed"))
    }

    try {
        
        // Token generation JWT
        const token = sign({sub:newUser._id},config.jwtSecret as string,{expiresIn:"7D",
          algorithm:"HS256"  
        })
        res.status(201).json({accessToken :token});
    } catch (error) {
        return next(createHttpError(500,"Error while signing the jwt token"))
    }

    //Response

};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }
  

    //Database call
    let user: User | null;
    try {
        
        user = await userModel.findOne({ email });
        if (!user) {
          return next(createHttpError(404, "User not found."));
        }
      
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch) {
          return next(createHttpError(400, "Username or password incorrect!"));
        }
      
    } catch (error) {
        return next(createHttpError(500,"Error Username or password incorrect!"))
    }

    try {
        
        const token = sign({ sub: user._id }, config.jwtSecret as string, {
            expiresIn: "7d",
            algorithm: "HS256",
          });
        
          res.json({ accessToken: token });
    } catch (error) {
        return next(createHttpError(500,"Error while signing the jwt token"))
    }
  
  };
export {createUser,loginUser};