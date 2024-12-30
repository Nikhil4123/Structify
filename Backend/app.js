import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import cors from "cors"; 
import connectDB from "./config/db.js";
import organizationRoutes from "./route/Organization.routes.js";
import teamRoutes from "./route/Team.routes.js";
import memberRoutes from "./route/Member.routes.js";

connectDB(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/organizations", organizationRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/members", memberRoutes);

export default app;
