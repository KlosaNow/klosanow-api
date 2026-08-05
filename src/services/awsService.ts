import {
	S3Client,
	GetObjectAttributesCommand,
	PutObjectCommand,
	DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import mime from "mime";

import {
	AWS_REGION,
	AWS_ACCESS_KEY,
	AWS_BUCKET_NAME,
	AWS_SECRET_ACCESS_KEY,
} from "../utils/config";

const s3 = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY!,
		secretAccessKey: AWS_SECRET_ACCESS_KEY!,
	},
});

export const getFileSizeFromS3 = async (filename: string): Promise<number> => {
	const { ObjectSize } = await s3.send(
		new GetObjectAttributesCommand({
			Bucket: AWS_BUCKET_NAME,
			Key: filename,
			ObjectAttributes: ["ObjectSize"],
		})
	);
	return ObjectSize!;
};

export const uploadFileToS3 = async (
	file: Express.Multer.File
): Promise<any> => {
	const fileExtension = file.originalname.split(".").pop();
	const filename = `${uuidv4()}.${fileExtension}`;
	const contentType =
		fileExtension === "webm"
			? "video/webm"
			: mime.lookup(filename, "application/octet-stream");

	await s3.send(
		new PutObjectCommand({
			Bucket: AWS_BUCKET_NAME,
			Key: filename,
			Body: file.buffer,
			// ACL: "public-read", // Somehow, passing this generates an error
			ContentType: contentType,
		})
	);

	const fileSize = Buffer.byteLength(file.buffer.toString(), "utf8");
	const url = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${filename}`;
	return { url, size: fileSize };
};

export const deleteFilesFromS3 = async (files: string[]): Promise<void> => {
	await s3.send(
		new DeleteObjectsCommand({
			Bucket: AWS_BUCKET_NAME,
			Delete: { Objects: files.map((file) => ({ Key: file })) },
		})
	);
};
