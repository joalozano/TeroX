import multer from "multer";
import path from "path";

const uploadDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, uploadDir);
	},
	filename: (_, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	}
});

const upload = multer({ storage });

export default upload;
