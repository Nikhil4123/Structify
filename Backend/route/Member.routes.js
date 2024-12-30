import express from "express";
import multer from "multer"; 
import { uploadToS3 } from "../middlewares/s3Upload.js"; 
import {
	addMember,
	uploadMemberImage,
} from "../controllers/Member.controller.js";

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post("/:teamId", upload.single("image"), async (req, res) => {
	try {
		const file = req.file;
		// if (!file) {
		// 	return res.status(400).json({ error: "No file uploaded." });
		// }

		await addMember(req, res);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.post("/upload/:memberId", upload.single("image"), uploadMemberImage);

export default router;
