import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
	name: String,
	email: String,
	location: String,
	teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],
});

export default mongoose.model("Organization", organizationSchema);
