import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import {
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} from "../utils/config";

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (
  file: Express.Multer.File
): Promise<any> => {
  const fileExtension = file.originalname.split(".").pop();
  const filename = `${uuidv4()}.${fileExtension}`;
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    // ACL: 'public-read',
  };
  const result = await s3.upload(params as any).promise();
  const fileSize = Buffer.byteLength(file.buffer, "utf8");
  return { url: result.Location, size: fileSize };
};

export const deleteFilesFromS3 = async (files: string[]): Promise<void> => {
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Delete: { Objects: files.map((file) => ({ Key: file })) },
  };
  await s3.deleteObjects(params as any).promise();
};
