import { Response } from "express"
import { CustomRequest } from "../../utils"
import Lesson from "../../models/Lesson";
import { notFoundError } from "../../utils/CustomError";
import { StatusCodes } from "http-status-codes";
import { successRes } from "../../helpers";


const getLesson = async (req: CustomRequest, res: Response) => {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById({ _id: lessonId });
    if (!lesson) {
        throw notFoundError('Lesson does not exist');
    }

    res
    .status(StatusCodes.OK)
    .json(successRes('Lesson retrieved successfully', lesson));
}

export default getLesson;