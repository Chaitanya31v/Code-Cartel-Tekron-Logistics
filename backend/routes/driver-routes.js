import express from "express";
import { Truck } from "../db.js";
import { authenticate, truckOnly } from "../middlewares/auth.js";

const router = express.Router();

// Driver updates GPS + status + usedTons
router.post("/update/:truckId", authenticate, truckOnly, async (req, res) => {
  try {
    // Ensure truckId matches authenticated truck
    if (req.truck.id.toString() !== req.params.truckId) {
      return res.status(403).json({ message: "Unauthorized: Truck ID mismatch" });
    }

    const { lat, lng, containerAvailable, delayMinutes, usedTons, status } = req.body;

    // Validate usedTons doesn't exceed capacity
    const truck = await Truck.findById(req.params.truckId);
    if (usedTons && usedTons > truck.capacityTons) {
      return res.status(400).json({ 
        message: `Used tons (${usedTons}) exceeds capacity (${truck.capacityTons})` 
      });
    }

    const updateData = {};
    if (lat !== undefined && lng !== undefined) {
      updateData.currentLocation = { lat, lng };
    }
    if (containerAvailable !== undefined) {
      updateData.containerAvailable = containerAvailable;
    }
    if (delayMinutes !== undefined) {
      updateData.delayMinutes = delayMinutes;
    }
    if (usedTons !== undefined) {
      updateData.usedTons = usedTons;
    }
    if (status && ["IDLE", "ON_TRIP"].includes(status)) {
      updateData.status = status;
    }

    const updatedTruck = await Truck.findByIdAndUpdate(
      req.params.truckId,
      updateData,
      { new: true }
    );

    res.json({ 
      message: "Truck updated successfully",
      truck: {
        id: updatedTruck._id,
        truckNumber: updatedTruck.truckNumber,
        currentLocation: updatedTruck.currentLocation,
        containerAvailable: updatedTruck.containerAvailable,
        delayMinutes: updatedTruck.delayMinutes,
        usedTons: updatedTruck.usedTons,
        availableTons: updatedTruck.availableTons,
        status: updatedTruck.status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get truck info (for driver to view)
router.get("/info/:truckId", authenticate, truckOnly, async (req, res) => {
  try {
    if (req.truck.id.toString() !== req.params.truckId) {
      return res.status(403).json({ message: "Unauthorized: Truck ID mismatch" });
    }

    const truck = await Truck.findById(req.params.truckId);
    if (!truck) {
      return res.status(404).json({ message: "Truck not found" });
    }

    res.json({
      id: truck._id,
      truckNumber: truck.truckNumber,
      capacityTons: truck.capacityTons,
      usedTons: truck.usedTons,
      availableTons: truck.availableTons,
      currentLocation: truck.currentLocation,
      containerAvailable: truck.containerAvailable,
      delayMinutes: truck.delayMinutes,
      status: truck.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;