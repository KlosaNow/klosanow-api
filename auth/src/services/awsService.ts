import AWS from 'aws-sdk';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  region: `${process.env.AWS_REGION}`,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: any) => {
  const fileExtension = file.originalname.split('.').pop();
  const filename = `${file.filename}${
    file.originalname
  }${uuidv4()}.${fileExtension}`;
  const fileSize = file.size;
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: filename,
    Body: fileStream,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return { url: result.Location, size: fileSize };
};

export const deleteFileFromS3 = async (key: string) => {
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: key,
  };
  await s3.deleteObject(params).promise();
};
