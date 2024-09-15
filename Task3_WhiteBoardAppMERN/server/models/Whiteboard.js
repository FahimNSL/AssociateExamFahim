const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema({
  drawingTitle: { type: String, required: true },
  shapeType: {
    type: String,
    enum: ["line", "circle", "rectangle", "text"],
    required: true,
  },
  shapeCoordination: [
    {
      type: { type: String, enum: ["line", "circle", "rectangle", "text"], required: true },
      start: {
        x: { type: Number, required: function() { return this.type === 'line' || this.type === 'rectangle'; } },
        y: { type: Number, required: function() { return this.type === 'line' || this.type === 'rectangle'; } },
      },
      end: {
        x: { type: Number, required: function() { return this.type === 'line' || this.type === 'rectangle'; } },
        y: { type: Number, required: function() { return this.type === 'line' || this.type === 'rectangle'; } },
      },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);
module.exports = Whiteboard;
