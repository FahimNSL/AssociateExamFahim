const Whiteboard = require("../models/Whiteboard");


const authMiddleware = (req, res, next) => {

  req.user = { _id: "userId", role: "User" }; 
  next();
};

// Get all drawings for the current user
const getAllDrawings = async (req, res) => {
  const { user, searchedUser, limit = 6, page = 1 } = req.body; // Default limit to 6, page to 1
;

  try {
    let query = {};

    // If the user is an Admin, they can search for drawings by a specific user
    if (user.role === "Admin") {
      if (searchedUser) {
        query.user = searchedUser;
      }
    } else {
      // Non-admin users can only see their own drawings
      query.user = user._id;
    }
;

    // Convert limit and page to integers
    const limitValue = parseInt(limit);
    const pageValue = parseInt(page);

    // Fetch drawings with pagination
    const whiteboards = await Whiteboard.find(query)
      .limit(limitValue) // Limit the number of results
      .skip((pageValue - 1) * limitValue) // Skip the appropriate number of results based on page

    // Count total drawings for the current query (to get the total number of pages)
    const totalDrawings = await Whiteboard.countDocuments(query);

    res.json({
      whiteboards,
      totalPages: Math.ceil(totalDrawings / limitValue), // Total number of pages
      currentPage: pageValue,
      totalDrawings, // Total number of drawings
    });
  } catch (error) {
    console.error("Error fetching drawings:", error); 
    res.status(500).json({ message: "Failed to get drawings", error });
  }
};


// Create a new drawing
const createDrawing = async (req, res) => {
  const { drawingTitle, shapeType, shapeCoordination, userId } = req.body;

  try {
    const whiteboard = new Whiteboard({
      drawingTitle,
      shapeType,
      shapeCoordination,
      user: userId, 
    });
    await whiteboard.save();
    res.status(201).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to create drawing", error });
  }
};

// Get a drawing by ID
const getDrawingById = async (req, res) => {
  const { id } = req.params;
  try {
    const whiteboard = await Whiteboard.findById(id);
    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }
    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to get drawing", error });
  }
};

// Update a specific drawing by ID
const updateDrawing = async (req, res) => {
  const { id } = req.params;
  const { shapeCoordination, drawingTitle } = req.body;

  try {

    const whiteboard = await Whiteboard.findByIdAndUpdate(
      id,
      { shapeCoordination, drawingTitle }, 
      { new: true } 
    );

    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    res.json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to update drawing", error });
  }
};

const deleteDrawing = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the drawing by ID and delete it
    const whiteboard = await Whiteboard.findByIdAndDelete(id);

    if (!whiteboard) {
      return res.status(404).json({ message: "Drawing not found" });
    }

    res.json({ message: "Drawing deleted successfully" });
  } catch (error) {
    console.error("Error deleting drawing:", error);
    res.status(500).json({ message: "Failed to delete drawing", error });
  }
};


module.exports = {
  authMiddleware,
  getAllDrawings,
  createDrawing,
  getDrawingById,
  updateDrawing,
  deleteDrawing
};