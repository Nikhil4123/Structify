import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true, 
	},
	uniqueId: {
		type: String,
		required: true, 
	},
	imageURL: {
		type: String,
		required: false, 
	},
});

export default mongoose.model("Member", memberSchema);
