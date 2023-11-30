import multer from "multer";

// Set up multer with memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
});
