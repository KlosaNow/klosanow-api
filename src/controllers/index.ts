import registerUser from "./auth/registerUser";
import loginUser from "./auth/loginUser";
import logoutUser from "./auth/logoutUser";
import verifyOTP from "./auth/verifyOTP";

import getAllUsers from "./user/getAllUsers";
import getUserById from "./user/getUserById";
import updateUserById from "./user/updateUserById";

import createLesson from "./lesson/createLesson";
import deleteLessonById from "./lesson/deleteLessonById";
import getAllLessons from "./lesson/getAllLessons";
import getLessonById from "./lesson/getLessonById";
import updateLessonById from "./lesson/updateLessonById";

import deleteVideo from "./media/deleteVideo";
import uploadVideo from "./media/uploadVideo";

export {
  // Auth
  registerUser,
  loginUser,
  verifyOTP,
  logoutUser,

  // User
  getAllUsers,
  getUserById,
  updateUserById,

  // Lesson
  createLesson,
  getAllLessons,
  getLessonById,
  deleteLessonById,
  updateLessonById,

  // Media
  deleteVideo,
  uploadVideo,
};
