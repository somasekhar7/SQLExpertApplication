import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  respondToTicket,
} from "../controllers/ticket.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", protectRoute, createTicket);
router.get("/my", protectRoute, getMyTickets);
router.get("/:id", protectRoute, getTicketById);

// Admin routes
router.get("/", protectRoute, adminRoute, getAllTickets);
router.patch("/:id/status", protectRoute, adminRoute, updateTicketStatus);
router.post("/:id/respond", protectRoute, adminRoute, respondToTicket);

export default router;
