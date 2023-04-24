import Lesson from '../models/lesson.model'
import dotenv from 'dotenv'
import express from 'express'

export async function createLesson(request: express.Request, response: express.Response){
    try{
        
    }
    catch(err){
        return response.status(500).json({
            status: "error",
            message: "Server error, try again later"
        })
    }
}
