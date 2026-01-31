import express from "express";
import { PR, Truck } from "../db.js";

const router = express.Router();

// Agent evaluates profitability
router.post("/evaluate/:prId", async (req, res) => {
  const pr = await PR.findById(req.params.prId);
  const trucks = await Truck.find({ containerAvailable: true });

  // Simple hackathon logic
  const estimatedCost = pr.distanceKm * 30;
  const profit = pr.priceOffered - estimatedCost;

  pr.agentEvaluation = {
    recommended: profit > 3000,
    expectedProfit: profit,
    risk: profit > 6000 ? "LOW" : "MEDIUM",
    reason: trucks.length
      ? "Empty container nearby"
      : "No nearby empty container"
  };

  await pr.save();
  res.json(pr.agentEvaluation);
});

export default router;
