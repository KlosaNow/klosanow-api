import { notFoundError } from "../../utils/CustomError";
import Lesson from "../../models/Lesson";
import { CustomRequest } from "../../utils";
import { deleteFileFromS3, deleteMultipleFileFromS3 } from "../../services/awsService";
import { StatusCodes } from "http-status-codes";
import { Response } from "express";
import { successRes } from "../../helpers";


const deleteLesson = async (req: CustomRequest, res: Response) => {
    const { lessonId } = req.query;

    const lesson = await Lesson.findById({_id: lessonId});
    if(!lesson) {
        throw notFoundError('Lesson does not exist');
    }

    const videoKey = lesson.videoUrl?.split("/").pop();
    const thumbnailKey = lesson.thumbnailUrl?.split("/").pop();

    await deleteFileFromS3(videoKey!)
    if(lesson.thumbnailUrl){
        await deleteFileFromS3(thumbnailKey!)
    }
    
    await lesson.deleteOne();

    res
    .status(StatusCodes.OK)
    .json(successRes('Lesson deleted successfully'));
}

export default deleteLesson;