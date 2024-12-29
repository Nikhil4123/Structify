import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
	name: String,
	members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
});

export default mongoose.model("Team", teamSchema);
