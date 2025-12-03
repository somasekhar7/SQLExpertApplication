import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

/**
 * POST /api/tickets
 * User submits a new support ticket
 */
export const createTicket = async (req, res) => {
  try {
    const { category, subject, description, priority } = req.body;
    const user = req.user; // from protectRoute middleware

    const ticket = await Ticket.create({
      userId: user._id,
      name: user.fullName,
      email: user.email,
      category,
      subject,
      description,
      priority: priority || "medium",
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: err.message });
  }
};

/**
 * GET /api/tickets/my
 * Get all tickets created by logged-in user
 */
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user tickets", error: err.message });
  }
};

/**
 * GET /api/tickets
 * Admin only — get all tickets (with optional filters)
 */
export const getAllTickets = async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const tickets = await Ticket.find(query).sort({ createdAt: -1 }).lean();

    res.json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: err.message });
  }
};

/**
 * GET /api/tickets/:id
 * View single ticket details
 */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).lean();
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Only admin or ticket owner can view
    if (
      req.user.role !== "admin" &&
      ticket.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching ticket", error: err.message });
  }
};

/**
 * PATCH /api/tickets/:id/status
 * Admin updates ticket status (open/in progress/resolved)
 */
export const updateTicketStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { status } = req.body;
    const updated = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ message: "Ticket status updated", ticket: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};

/**
 * POST /api/tickets/:id/respond
 * Admin (or support staff) responds to ticket
 */
export const respondToTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const { message } = req.body;
    const response = {
      responderId: req.user._id,
      responderName: req.user.fullName,
      message,
    };

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { responses: response }, status: "in progress" },
      { new: true }
    );

    res.json({ message: "Response added", ticket: updatedTicket });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding response", error: err.message });
  }
};
