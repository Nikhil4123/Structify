import express from "express";
import multer from "multer"; // Ensure Multer is properly set up
import { uploadToS3 } from "../middlewares/s3Upload.js"; // Import the S3 upload function
import {
	addMember,
	uploadMemberImage,
} from "../controllers/Member.controller.js";

const router = express.Router();

// Multer setup to handle file uploads
const storage = multer.memoryStorage(); // Using memory storage to store file in memory
const upload = multer({ storage: storage });

// Route to add a new member with image upload to S3
router.post("/:teamId", upload.single("image"), async (req, res) => {
	try {
		// Check if a file is uploaded
		const file = req.file;
		// if (!file) {
		// 	return res.status(400).json({ error: "No file uploaded." });
		// }

		// Call the addMember controller, passing the file to S3
		await addMember(req, res);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Route to upload an image for a member
router.post("/upload/:memberId", upload.single("image"), uploadMemberImage);

export default router;
