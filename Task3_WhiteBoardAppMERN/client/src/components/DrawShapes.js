export const drawShapes = (canvas, shapes) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Get the canvas size
  const canvasWidth = canvas.parentElement.offsetWidth;
  const canvasHeight = canvas.parentElement.offsetHeight;

  // Determine the bounding box of all shapes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  shapes.forEach((shape) => {
    const { start = {}, end = {} } = shape;
    if (start.x !== undefined && start.y !== undefined && end.x !== undefined && end.y !== undefined) {
      minX = Math.min(minX, start.x, end.x);
      minY = Math.min(minY, start.y, end.y);
      maxX = Math.max(maxX, start.x, end.x);
      maxY = Math.max(maxY, start.y, end.y);
    }
  });

  // Calculate the scale factor to fit the bounding box within the canvas
  const widthScale = canvasWidth / (maxX - minX);
  const heightScale = canvasHeight / (maxY - minY);
  const scale = Math.min(widthScale, heightScale);

  // Set canvas size and scale
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  // Set styles
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  // Draw each shape with scaling applied
  shapes.forEach((shape) => {
    const { start = {}, end = {}, type ,content} = shape;

    // Ensure start and end are defined
    if (start.x !== undefined && start.y !== undefined && end.x !== undefined && end.y !== undefined) {
      // Apply scaling
      const scaledStart = { x: (start.x - minX) * scale, y: (start.y - minY) * scale };
      const scaledEnd = { x: (end.x - minX) * scale, y: (end.y - minY) * scale };

      switch (type) {
        case "line":
          // Draw a line
          ctx.beginPath();
          ctx.moveTo(scaledStart.x, scaledStart.y);
          ctx.lineTo(scaledEnd.x, scaledEnd.y);
          ctx.stroke();
          break;

        case "circle":
          // Calculate radius and center
          const radius = Math.sqrt(
            (scaledEnd.x - scaledStart.x) ** 2 + (scaledEnd.y - scaledStart.y) ** 2
          );
          ctx.beginPath();
          ctx.arc(scaledStart.x, scaledStart.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        case "rectangle":
          // Draw a rectangle
          const width = scaledEnd.x - scaledStart.x;
          const height = scaledEnd.y - scaledStart.y;
          ctx.beginPath();
          ctx.rect(scaledStart.x, scaledStart.y, width, height);
          ctx.stroke();
          break;
        case "text":
          // Draw text
          ctx.font = "16px Arial"; // Adjust font size and family as needed
          ctx.fillStyle = "black";
          ctx.fillText(content || "Default Text", scaledStart.x, scaledStart.y); // Ensure content is rendered
          break;


        default:
          console.error("Unknown shape type:", type);
          break;
      }
    } else {
      console.error("Shape is missing required coordinates:", shape);
    }
  });
};
