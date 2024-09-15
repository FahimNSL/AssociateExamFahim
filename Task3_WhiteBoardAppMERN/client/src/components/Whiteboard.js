import React, { useRef, useState, useEffect } from "react";
import { Button, Box ,TextField} from "@mui/material";

const Whiteboard = ({ shapeType, onShapesUpdate, isSaved, setShapes, shapes }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState({ x: 1, y: 1 });
  const [textInput, setTextInput] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const setCanvasSize = () => {

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;


      setCanvasScale({
        x: canvas.width / container.clientWidth,
        y: canvas.height / container.clientHeight,
      });

      drawAllShapes(); 
    };

   
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    return () => window.removeEventListener("resize", setCanvasSize);
  }, [shapeType, shapes]);

  const getMousePosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const distance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };
  console.log({shapes});
  

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const mousePos = getMousePosition(canvas, e);
    setStartPoint(mousePos);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mousePos = getMousePosition(canvas, e);

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawAllShapes(); 

  
    if (shapeType !== "eraser") {
      drawCurrentShape(ctx, startPoint, mousePos);
    }
  };



  const handleMouseUp = (e) => {
    const canvas = canvasRef.current;
    const mousePos = getMousePosition(canvas, e);

    if (shapeType === "eraser") {

      const updatedShapes = shapes.filter((shape) => !isPointInShape(mousePos, shape));
      setShapes(updatedShapes);
      onShapesUpdate(updatedShapes);
    } else if (shapeType === "text") {
      
     
      setTextInput({ x: mousePos.x, y: mousePos.y, value: "" });
    }
    else {

      const newShape = {
        type: shapeType,
        start: startPoint,
        end: mousePos,
      };
      const updatedShapes = [...shapes, newShape];
      setShapes(updatedShapes); 
      onShapesUpdate(updatedShapes);
    }

    setIsDrawing(false);
  };

  const handleTextInput = (e) => {
    setTextInput({ ...textInput, value: e.target.value });
  };


  const handleTextSubmit = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      if (textInput && textInput.value.trim() !== "") {
      
        const newTextShape = {
          type: "text",
          text: textInput.value,
          position: { x: textInput.x, y: textInput.y }, 
        };
        setShapes([...shapes, newTextShape]);
        
        const updatedShapes = [...shapes, newTextShape];
        setShapes(updatedShapes); 
        onShapesUpdate(updatedShapes); 
      }
  
      // Remove the text input after submission
      setTextInput(null);
    }
  };
  
  const drawShape = (ctx, shape) => {
    const { type, start, end } = shape;

    switch (type) {
      case "line":
        drawLine(ctx, start, end);
        break;
      case "rectangle":
        drawRectangle(ctx, start, end);
        break;
      case "circle":
        drawCircle(ctx, start, end);
        break;
      case "text":
        drawText(ctx, shape.text, shape.position);
        break;
      default:
        break;
    }
  };

  const drawText = (ctx, text, position) => {
    console.log("Text Position:", position);
    if (position && text) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(text, position.x, position.y);
    }
  };
  

  const drawCurrentShape = (ctx, start, end) => {
    switch (shapeType) {
      case "line":
        drawLine(ctx, start, end);
        break;
      case "rectangle":
        drawRectangle(ctx, start, end);
        break;
      case "circle":
        drawCircle(ctx, start, end);
        break;
      default:
        break;
    }
  };
  
  const isPointInShape = (point, shape) => {
    console.log({shape});
    
    const { type, start, end, text, position } = shape;

    switch (type) {
      case "line":
        const distanceToLine = Math.abs(
          (end.y - start.y) * point.x - (end.x - start.x) * point.y + end.x * start.y - end.y * start.x
        ) / Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
        return distanceToLine < 5;

      case "rectangle":
        return (
          point.x >= Math.min(start.x, end.x) &&
          point.x <= Math.max(start.x, end.x) &&
          point.y >= Math.min(start.y, end.y) &&
          point.y <= Math.max(start.y, end.y)
        );

      case "circle":
        // Check if point is inside circle
        const radius = distance(start, end);
        const distanceToCenter = Math.sqrt(
          Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)
        );
        return distanceToCenter <= radius;

        case "text":
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Measure the text
      ctx.font = "16px Arial"; 
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 16; 

      // Create bounding box for text
      const textBoundingBox = {
        x: position.x,
        y: position.y - textHeight, // Adjust for text height
        width: textWidth,
        height: textHeight
      };

      return (
        point.x >= textBoundingBox.x &&
        point.x <= textBoundingBox.x + textBoundingBox.width &&
        point.y >= textBoundingBox.y &&
        point.y <= textBoundingBox.y + textBoundingBox.height
      );
        
        

      default:
        return false;
    }
  };


  const drawLine = (ctx, start, end) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawRectangle = (ctx, start, end) => {
    const width = end.x - start.x;
    const height = end.y - start.y;
    ctx.beginPath();
    ctx.rect(start.x, start.y, width, height);
    ctx.stroke();
  };

  const drawCircle = (ctx, start, end) => {
    const radius = distance(start, end);
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setShapes([]); // Reset shapes
    onShapesUpdate([]);
  };

  const drawAllShapes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach((shape) => drawShape(ctx, shape));
  };

  useEffect(() => {
    drawAllShapes(); // Redraw shapes when saved
  }, [isSaved]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid black",
          display: "block",
          width: "95%",
          height: "80%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {textInput && (
        <TextField
          variant="outlined"
          size="small"
          style={{
            position: "absolute",
            top: textInput.y,
            left: textInput.x,
            transform: "translate(-50%, -50%)",
          }}
          placeholder="Press Enter to Save"
          value={textInput.value}
          onChange={handleTextInput}
          onKeyDown={handleTextSubmit}
          onBlur={handleTextSubmit} 
          autoFocus
        />
      )}
      <Box sx={{ position: "absolute", bottom: 0, right: 400 , marginBottom:"30px"}}>
        <Button size="small" variant="contained" color="primary" onClick={clearCanvas}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default Whiteboard;
