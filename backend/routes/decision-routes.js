import express from "express";
import { PR } from "../db.js";
import { authenticate, ownerOnly } from "../middlewares/auth.js";

const router = express.Router();

// Accept / Reject PR
router.post("/:prId", authenticate, ownerOnly, async (req, res) => {
  const { decision } = req.body; // ACCEPTED / REJECTED

  const pr = await PR.findById(req.params.prId);
  pr.status = decision;

  await pr.save();
  res.json(pr);
});

export default router;
