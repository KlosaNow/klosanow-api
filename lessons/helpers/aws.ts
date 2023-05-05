import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'
dotenv.config()

// Set up AWS credentials
AWS.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  region: `${process.env.AWS_REGION}`
});


// Create S3 client
const s3 = new AWS.S3();

// Define function to upload file to S3 bucket
const uploadFileToS3 = async (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: filename,
    Body: file.buffer,
    ACL: 'public-read',
  };
  const result = await s3.upload(params as any).promise();
  const fileSize = Buffer.byteLength(file.buffer, 'utf8');
  return { url: result.Location, size: fileSize };
};


// define function to delete file from S3 bucket
async function deleteFileFromS3(key: string) {
  try {
    const params = {
      Bucket: `${process.env.AWS_BUCKET_NAME}`,
      Key: key,
    };
    await s3.deleteObject(params as any ).promise();
  } catch (error) {
    throw error;
  }
}
export {uploadFileToS3, deleteFileFromS3}
