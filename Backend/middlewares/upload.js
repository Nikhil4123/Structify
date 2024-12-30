import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); 
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new Error("Only images (jpeg, jpg, png) are allowed."));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, 
});

export default upload;
