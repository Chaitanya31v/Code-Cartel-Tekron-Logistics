import express from "express";
import { Truck } from "../db.js";
import { authenticate, ownerOnly } from "../middlewares/auth.js";

const router = express.Router();

// Create truck
router.post("/", authenticate, ownerOnly, async (req, res) => {
  const truck = await Truck.create({
    ...req.body,
    owner: req.user.id
  });
  res.json(truck);
});

// Get owner trucks
router.get("/", authenticate, ownerOnly, async (req, res) => {
  const trucks = await Truck.find({ owner: req.user.id });
  res.json(trucks);
});

export default router;
