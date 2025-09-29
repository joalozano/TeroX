import { Router } from "express";
import { pool } from "../config/db";

const router = Router();

router.get("/", async (_, res) => {
	res.sendStatus(404);
});

export default router;
