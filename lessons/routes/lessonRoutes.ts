import express from 'express'
import multer from 'multer'
const router = express.Router()
import {createLesson, deleteLesson, editLesson, getAllLessons, getLesson} from '../controllers/lessons.controller'

const storage = multer.memoryStorage();
const upload = multer({storage})

router.post('/createLesson', upload.single('contentUrl'), createLesson)
router.delete('/deleteLesson', deleteLesson)
router.put('/updateLesson', upload.single('contentUrl'), editLesson)
router.get('/getLesson', getLesson)
router.get('/getLessons', getAllLessons)

export default router