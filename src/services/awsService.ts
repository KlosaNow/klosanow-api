import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import mime from "mime";

import {
	AWS_REGION,
	AWS_ACCESS_KEY,
	AWS_BUCKET_NAME,
	AWS_SECRET_ACCESS_KEY,
} from "../utils/config";

AWS.config.update({
	region: AWS_REGION,
	accessKeyId: AWS_ACCESS_KEY,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

export const getFileSizeFromS3 = async (filename: string): Promise<number> => {
	const params = {
		Bucket: AWS_BUCKET_NAME,
		Key: filename,
		ObjectAttributes: ["ObjectSize"],
	};
	const { ObjectSize } = await s3
		.getObjectAttributes(params as any)
		.promise();
	return ObjectSize!;
};

export const uploadFileToS3 = async (
	file: Express.Multer.File
): Promise<any> => {
	const fileExtension = file.originalname.split(".").pop();
	const filename = `${uuidv4()}.${fileExtension}`;
	const params = {
		Bucket: AWS_BUCKET_NAME,
		Key: filename,
		Body: file.buffer,
		ACL: "public-read",
		ContentType: mime.lookup(filename, "application/octet-stream"),
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
