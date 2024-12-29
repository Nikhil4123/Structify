import Team from "../models/Team.js";
import Organization from "../models/Organization.js";

export const addTeam = async (req, res) => {
	try {
		const team = await Team.create(req.body);
		await Organization.findByIdAndUpdate(req.params.orgId, {
			$push: { teams: team._id },
		});
		res.status(201).json(team);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


// Get all teams
export const getAllTeams = async (req, res) => {
	try {
		const teams = await Team.find().populate("members");
		res.status(200).json(teams);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get specific team by ID
export const getTeamById = async (req, res) => {
	try {
		const { teamId } = req.params;
		const team = await Team.findById(teamId).populate("members");

		if (!team) {
			return res.status(404).json({ error: "Team not found." });
		}

		res.status(200).json(team);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
