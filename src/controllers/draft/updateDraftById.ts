import { Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Draft } from "../../models";
import {
    errorRes,
    successRes,
    CustomRequest,
    notFoundError,
} from "../../utils";

const updateDraftById = async (req: CustomRequest, res: Response) => {
    try {
        const { id } = req.params;
        const draft = await Draft.findById({ _id: id });
        if (!draft) throw notFoundError("Draft not found");

        const {
            tag,
            about,
            title,
            content,
            videoUrl,
            isPrivate,
            videoSize,
            thumbnailUrl,
            thumbnailSize,
        } = req.body;

        draft.tag = tag ? tag : draft.tag;
        draft.about = about?.trim() ? about : draft.about;
        draft.title = title?.trim() ? title : draft.title;
        draft.isPrivate = isPrivate ? isPrivate : draft.isPrivate;
        draft.content = content?.trim() ? content : draft.content;
        draft.videoUrl = videoUrl?.trim() ? videoUrl : draft.videoUrl;
        draft.videoSize = videoSize?.trim() ? videoSize : draft.videoSize;
        draft.thumbnailUrl = thumbnailUrl?.trim()
            ? thumbnailUrl
            : draft.thumbnailUrl;
        draft.thumbnailSize = thumbnailSize?.trim()
            ? thumbnailSize
            : draft.thumbnailSize;

        await draft.save();

        res.status(StatusCodes.OK).json(
            successRes("Draft updated successfully", draft)
        );
    } catch (err: any) {
        res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(
            errorRes(err.message)
        );
    }
};

export default updateDraftById;
