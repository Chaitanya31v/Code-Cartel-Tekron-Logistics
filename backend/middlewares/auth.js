// middlewares/auth.js
import jwt from "jsonwebtoken";
import { Truck } from "../db.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a truck token
    if (decoded.role === "TRUCK") {
      req.truck = { id: decoded.id, truckNumber: decoded.truckNumber };
    } else {
      req.user = decoded; // { id, role }
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role based guards
export const ownerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "OWNER") {
    return res.status(403).json({ message: "Owner access only" });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "USER") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

// Truck only guard
export const truckOnly = (req, res, next) => {
  if (!req.truck) {
    return res.status(403).json({ message: "Truck access only" });
  }
  next();
};