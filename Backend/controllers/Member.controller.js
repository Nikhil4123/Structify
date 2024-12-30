import Member from "../models/Member.js";
import Team from "../models/Team.js";
import { uploadToS3 } from "../middlewares/s3Upload.js"; // Import the upload function for S3

// Upload image for a member to S3 and store in the database
export const uploadMemberImage = async (req, res) => {
	try {
		const { memberId } = req.params;
		const file = req.file;

		if (!file) {
			return res.status(400).json({ error: "No file uploaded." });
		}

		// Find the member
		const member = await Member.findById(memberId);

		if (!member) {
			return res.status(404).json({ error: "Member not found." });
		}

		// Generate a unique file key
		const fileKey = `${Date.now()}-${file.originalname}`;

		// Upload the file to S3
		const imageUrl = await uploadToS3(
			file,
			process.env.AWS_BUCKET_NAME,
			`members-images/${fileKey}`
		);

		// Update the member's image URL
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

// Add a new member and store the image URL in the database
export const addMember = async (req, res) => {
	try {
		const { name, uniqueId } = req.body;
		const file = req.file; // Get the uploaded file
		let imageUrl = null;

		// Only process image upload if a file was provided
		if (file) {
			// Generate a unique key for the file (timestamp + original name)
			const fileKey = `${Date.now()}-${file.originalname}`;

			// Upload the file to S3 and get the URL
			imageUrl = await uploadToS3(
				file,
				process.env.AWS_BUCKET_NAME,
				`members-images/${fileKey}`
			);
		}

		// Create a new member record
		const memberData = {
			name,
			uniqueId,
			...(imageUrl && { imageURL: imageUrl }), // Only include imageURL if an image was uploaded
		};

		const member = await Member.create(memberData);

		// Find the team using the teamId from the URL
		const team = await Team.findById(req.params.teamId);

		if (!team) {
			return res.status(404).json({ error: "Team not found." });
		}

		// Add the newly created member to the team
		team.members.push(member._id);
		await team.save();

		res.status(201).json(member);
	} catch (error) {
		console.error("Error adding member:", error);
		res.status(500).json({ error: error.message });
	}
};