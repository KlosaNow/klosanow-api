import {
  getFileSizeFromS3,
  deleteFilesFromS3,
  uploadFileToS3,
} from "./awsService";
import sendOtpService from "./otpService";

export {
  // OTP services
  sendOtpService,

  // AWS services
  getFileSizeFromS3,
  deleteFilesFromS3,
  uploadFileToS3,
};
