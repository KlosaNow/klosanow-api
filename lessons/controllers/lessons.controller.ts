import { Request, Response } from 'express';
import Lesson from '../models/lesson.model';
import {uploadFileToS3, deleteFileFromS3} from '../helpers/aws'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config()

async function createLesson(request: Request, response: Response) {
    try {
        const { title, note, isPrivate } = request.body
        const { url: photoUrl, size: photoSize } = await uploadFileToS3(request.file!);
        const content = photoUrl
        
        const savedLessons = new Lesson({
            title: title,
            note: note,
            isPrivate: isPrivate,
            contentUrl: content,
            size: photoSize
        })

        await savedLessons.save()
        return response.status(201).json({
            status: true,
            message: "Lesson created successfully",
            lesson: savedLessons
        })
    }
    catch(err: any){
        return response.status(500).json({
            status: false,
            error: err.message,
            message: "Server error occured, try again later"
        })
    }
}

async function deleteLesson(request: Request, response: Response){
    try {
        const lessonId = request.query.lessonId
        const lesson = await Lesson.findById({_id: lessonId})
        if(!lesson){
            return response.status(404).json({
                status: "false",
                message: "Lesson does not exists"})
        }

        // Delete file from S3
        const oldFileKey = lesson.contentUrl?.split("/").pop();
        await deleteFileFromS3(oldFileKey as any);
        
        //delete it from database
        await lesson.deleteOne()
        return response.status(200).json({
            status: true,
            message: "Lesson deleted successfully"
        })
    }
    catch(err: any){
        return response.status(500).json({
            status: false,
            error: err.message,
            message: "Server error occured, try again later"
        })
    }
}

async function editLesson(request: Request, response: Response) {
    try {
      const  lessonId  = request.query.lessonId;
      const { title, note, isPrivate } = request.body;
      const file = request.file;
  
      // Find the lesson in the database
      const lesson = await Lesson.findById({_id: lessonId});
  
      // If the lesson doesn't exist, return an error
      if (!lesson) {
        return response.status(404).json({ 
            status: "false",
            message: "Lesson does not exists" });
      }
  
      // If a file was uploaded, update the lesson's content URL and size
      if (file) {
        // Upload file to S3 and get URL
        const { url: photoUrl, size: photoSize } = await uploadFileToS3(request.file!);
  
        // Delete old file from S3
        const oldFileKey = lesson.contentUrl?.split("/").pop();
        await deleteFileFromS3(oldFileKey as any);

        // Update the lesson's content URL and size
        lesson.contentUrl = photoUrl;
        lesson.size = photoSize as any
      }
  
        // Update lesson fields
        lesson.title = title || lesson.title;
        lesson.note = note || lesson.note;
        lesson.isPrivate = isPrivate || lesson.isPrivate;
  
      // Save the updated lesson in the database
      const savedLesson = await lesson.save();
  
      return response.status(200).json({
        status: true,
        message: "Lesson updated successfully",
        lesson: savedLesson,
      });
    } catch(err: any){
        return response.status(500).json({
            status: false,
            error: err.message,
            message: "Server error occured, try again later"
        })
    }
}

async function getLesson(request: Request, response: Response){
    try {
        const lessonId = request.query.lessonId
        const lesson = await Lesson.findById({_id: lessonId})
        if (!lesson) {
            return response.status(404).json({ 
                status: "false",
                message: "Lesson does not exists" });
            }
        return response.status(200).json({
            status: true,
            lesson: lesson,
        })
    }
    catch(err: any){
        return response.status(500).json({
            status: false,
            error: err.message,
            message: "Server error occured, try again later"
        })
    }
}

async function getAllLessons(request: Request, response: Response){
    try {
        const lessons = await Lesson.find().exec()
        if(lessons.length === 0){
            return response.status(404).json({
                status: false,
                message: "No lesson exists, please create some"
            })
        }
        return response.status(200).json({
            status: true,
            message: "Lesson fetched successfully",
            Lessons: lessons
        })
    }
    catch(err: any){
        return response.status(500).json({
            status: false,
            error: err.message,
            message: "Server error occured, try again later"
        })
    }
}

export { createLesson, deleteLesson, editLesson, getLesson, getAllLessons };
