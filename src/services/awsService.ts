import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({
  accessKeyId: `${process.env.AWS_ACCESS_KEYS}`,
  secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  region: `${process.env.AWS_REGION}`,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}`,
    Key: filename,
    Body: file.buffer,
    // ACL: 'public-read',
  };
  const result = await s3.upload(params as any).promise();
  const fileSize = Buffer.byteLength(file.buffer, 'utf8');
  return { url: result.Location, size: fileSize };
};

// export const uploadFileToS3 = async (file:any | Express.Multer.File) => {
//   // const fileExtension = file.filename.split('.').pop();
//   // const filename = `${uuidv4()}.${fileExtension}`;
//   // const fileSize = file.size;
//   // const fileStream = fs.createReadStream(file.path);
//   const buffer = new Buffer('', 'utf-8')

//   const params = {
//     Bucket: `${process.env.AWS_BUCKET_NAME}`,
//     Key: file,
//     Body: buffer,
//     ACL: 'public-read',
//   };

//   const result = await s3.upload(params).promise();
//   const fileSize = Buffer.byteLength(file.buffer, 'utf8');
//   return { url: result.Location, size: fileSize };
// };

export const deleteMultipleFileFromS3 = async (files: string[]): Promise<void> => {
    const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Delete: {
            Objects: files.map((file) => ({ Key: file })),
        }
    }

    await s3.deleteObjects(params).promise();
};

export const deleteFileFromS3 = async (key: string) => {
    const params = {
        Bucket: `${process.env.AWS_BUCKET_NAME}`,
        Key: key
    }

    await s3.deleteObject(params).promise();
}
