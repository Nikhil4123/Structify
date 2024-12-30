import Organization from "../models/Organization.js";

export const createOrganization = async (req, res) => {
	try {
		const organization = await Organization.create(req.body);
		res.status(201).json(organization);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getOrganizations = async (req, res) => {
	try {
		const organizations = await Organization.find().populate("teams");
		res.status(200).json(organizations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getOrganizationById = async (req, res) => {
	try {
		const { orgId } = req.params;

		const organization = await Organization.findById(orgId).populate({
			path: "teams", 
			populate: {
				path: "members", 
			},
		});

		if (!organization) {
			return res.status(404).json({ error: "Organization not found." });
		}

		res.status(200).json(organization);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
