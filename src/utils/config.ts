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

export const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export const COMPANY_EMAIL = process.env.COMPANY_EMAIL;
export const ZEPTOMAIL_API_KEY = process.env.ZEPTOMAIL_API_KEY;
export const FRONTEND_URL = process.env.FRONTEND_URL;

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
export const VAPID_SUBJECT = process.env.VAPID_SUBJECT;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
export const GEMINI_CONDENSE_MODEL =
	process.env.GEMINI_CONDENSE_MODEL || GEMINI_MODEL;
export const GEMINI_THINKING_BUDGET = process.env.GEMINI_THINKING_BUDGET;
export const GEMINI_BASE_URL = (
	process.env.GEMINI_BASE_URL ||
	"https://generativelanguage.googleapis.com/v1beta"
).replace(/\/+$/, "");
export const LLM_STRUCTURED_OUTPUT = process.env.LLM_STRUCTURED_OUTPUT !== "false";

export const SLIDES_MAX_PAGES = Number(process.env.SLIDES_MAX_PAGES) || 60;
export const SLIDES_MAX_UPLOAD_MB = Number(process.env.SLIDES_MAX_UPLOAD_MB) || 25;
export const SLIDES_DEFAULT_COUNT = Number(process.env.SLIDES_DEFAULT_COUNT) || 12;
export const SLIDES_CONDENSE_THRESHOLD_TOKENS =
	Number(process.env.SLIDES_CONDENSE_THRESHOLD_TOKENS) || 15000;
