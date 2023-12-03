import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;

export const DATABASE_URI = process.env.DATABASE_URI;

export const JWT_SECRET = process.env.JWT_SECRET;

export const INFOBIP_SENDER = process.env.INFOBIP_SENDER;
export const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
export const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL;

export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEYS;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;