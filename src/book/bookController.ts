import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import { title } from "node:process";
import bookModel from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";
import createHttpError from "http-errors";
const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {} =req.body;
    console.log("files",req.files);
    // const coverImageMimeType=req.files.coverImage[0];
    const files =req.files as {[fieldname:string]:Express.Multer.File[]};
    const coverImageMimeType=files.coverImage[0].mimetype.split('/').at(-1);
    const fileName=files.coverImage[0].filename;
    const filePath=path.resolve(__dirname,'../../public/data/uploads',fileName)

    const uploadResult= await cloudinary.uploader.upload(filePath,{
        filename_override:fileName,
        folder:'book-covers',
        formate:coverImageMimeType,
    })

    const bookFileName =files.file[0].filename;
    const bookFilePath =path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
    );
 

    let genre: string;
    genre = "fiction"; 
    
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        });

        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            bookFileName
        );

        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-pdfs",
                format: "pdf",
            }
        );
        const _req = req as AuthRequest;

        const newBook = await bookModel.create({
            title,
            genre,
            author: _req.userId,
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,
        });

        // Delete temp.files
        // todo: wrap in try catch...
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);

        res.status(201).json({ id: newBook._id });
    } catch (err) {
        console.log(err);
        return next(createHttpError(500, "Error while uploading the files."));
    }


    console.log("uploadResult",uploadResult);
   res.json({});

};



export { createBook };
