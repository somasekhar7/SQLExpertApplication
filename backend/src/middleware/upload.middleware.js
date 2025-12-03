import multer from "multer";

// store file in memory instead of disk
const storage = multer.memoryStorage();

export const upload = multer({ storage });
