import express from "express";
import {
	createOrganization,
	getOrganizations,
    getOrganizationById
} from "../controllers/Organization.controller.js";

const router = express.Router();
router.post("/", createOrganization);
router.get("/", getOrganizations);
router.get('/:orgId', getOrganizationById);

export default router;
