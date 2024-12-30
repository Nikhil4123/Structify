import Member from "../models/Member.js";
import Team from "../models/Team.js";
import { uploadToS3 } from "../middlewares/s3Upload.js"; 

export const uploadMemberImage = async (req, res) => {
	try {
		const { memberId } = req.params;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ error: "No file uploaded." });
		}

		const member = await Member.findById(memberId);

		if (!member) {
			return res.status(404).json({ error: "Member not found." });
		}

		const fileKey = `${Date.now()}-${file.originalname}`;

		const imageUrl = await uploadToS3(
			file,
			process.env.AWS_BUCKET_NAME,
			`members-images/${fileKey}`
		);

		member.imageURL = imageUrl;
		await member.save();

		res.status(200).json({
			message: "Image uploaded successfully.",
			member,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const addMember = async (req, res) => {
	try {
		const { name, uniqueId } = req.body;
		const file = req.file; 
		let imageUrl = null;

		if (file) {
			const fileKey = `${Date.now()}-${file.originalname}`;

			imageUrl = await uploadToS3(
				file,
				process.env.AWS_BUCKET_NAME,
				`members-images/${fileKey}`
			);
		}

		const memberData = {
			name,
			uniqueId,
			...(imageUrl && { imageURL: imageUrl }), 
		};

		const member = await Member.create(memberData);

		const team = await Team.findById(req.params.teamId);

		if (!team) {
			return res.status(404).json({ error: "Team not found." });
		}

		team.members.push(member._id);
		await team.save();

		res.status(201).json(member);
	} catch (error) {
		console.error("Error adding member:", error);
		res.status(500).json({ error: error.message });
	}
};
