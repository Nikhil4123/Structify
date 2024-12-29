import express from "express";
import {
	addTeam,
	getAllTeams,
	getTeamById,
} from "../controllers/Team.controller.js";

const router = express.Router();
router.post("/:orgId", addTeam);
router.get("/", getAllTeams);
router.get("/:teamId", getTeamById);

export default router;
