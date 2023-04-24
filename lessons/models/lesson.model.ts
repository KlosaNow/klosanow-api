import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    contentUrl: {
        type: String,
    },
    private: {
        type: Boolean
    },
    size: {
        type: String
    }
}, {timestamps: true})

export default mongoose.model("Lesson", lessonSchema)