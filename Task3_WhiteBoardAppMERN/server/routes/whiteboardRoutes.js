const express = require("express");
const {
  authMiddleware,
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing
} = require("../controllers/whiteboardController");
const router = express.Router();

// Get all drawings for current user
router.post("/drawings", getAllDrawings);

// Get a specific drawing by ID
router.get("/drawings/:id", getDrawingById);

// Create a new drawing
router.post("/create", createDrawing);

// Update a specific drawing by ID
router.put("/drawings/:id", updateDrawing);

// Delete a specific drawing by ID
router.delete("/drawings/:id", deleteDrawing);

module.exports = router;
