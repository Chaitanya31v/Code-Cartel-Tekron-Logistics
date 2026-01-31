import express from "express";
import { PR } from "../db.js";
import { authenticate, userOnly, ownerOnly } from "../middlewares/auth.js";

const router = express.Router();

// User raises PR
router.post("/", authenticate, userOnly, async (req, res) => {
  const pr = await PR.create({
    ...req.body,
    raisedBy: req.user.id
  });
  res.json(pr);
});

// User views own PRs
router.get("/my", authenticate, userOnly, async (req, res) => {
  const prs = await PR.find({ raisedBy: req.user.id });
  res.json(prs);
});

// Owner views pending PRs
router.get("/pending", authenticate, ownerOnly, async (req, res) => {
  const prs = await PR.find({ status: "PENDING" });
  res.json(prs);
});

export default router;
