import { Response } from "express";
import { Lesson } from "../../models";
import { successRes } from "../../helpers";
import { CustomRequest } from "../../utils";

const getAllLessons = async (req: CustomRequest, res: Response) => {
    const lessons = await Lesson.find({});

    res.status(200).json(
        successRes("All lessons retrieved successfully", lessons)
    );
};

export default getAllLessons;
