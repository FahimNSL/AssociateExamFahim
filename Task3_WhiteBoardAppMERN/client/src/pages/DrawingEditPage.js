import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetDrawingByIdQuery, useUpdateDrawingMutation } from "../Apis/whiteboardApiSlice";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@mui/material";
import Whiteboard from "../components/Whiteboard";
import { toast } from "react-toastify";

const DrawingEditPage = () => {
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shapeType, setShapeType] = useState("line");
  const [shapeCoordination, setShapeCoordination] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [shapes, setShapes] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); 

  const { id } = useParams();  
  const navigate = useNavigate();

  // Fetch drawing data
  const { data, error, isLoading,refetch } = useGetDrawingByIdQuery(id);

  useEffect(() => {
    // Refetch the data whenever this component is mounted to get the latest data
    refetch();
  }, [id, refetch]);
  const [updateDrawing, { isLoading: isUpdating }] = useUpdateDrawingMutation();

  useEffect(() => {
    if (data) {
      setDrawingTitle(data.drawingTitle || ""); 
      setShapes(data.shapeCoordination || []); 
      setShapeCoordination(data.shapeCoordination || []); 
    }
  }, [data]);

  const handleShapeUpdate = (newShapes) => {
    console.log("new shapes", newShapes);
    setShapeCoordination(newShapes);
    setShapes(newShapes); 
  };

  const handleSave = async () => {
    try {
      await updateDrawing({ id, shapeCoordination: shapes, drawingTitle }).unwrap();
      setIsSaved(true);
      toast.success("draw updated successfully")
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Failed to save drawing", error);
    }
  };

  if (isLoading || isUpdating) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 4 }} />;
  if (error) return <Typography color="error" variant="h6" align="center">Failed to load drawing</Typography>;

  return (
    <Container maxWidth="md" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Drawing: {drawingTitle}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
          marginBottom: 3,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <RadioGroup
          row
          value={shapeType}
          onChange={(e) => setShapeType(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: isSmallScreen ? "100%" : 500, marginTop: isSmallScreen ? 2 : 0 }}
        >
          <FormControlLabel value="line" control={<Radio />} label="Line" />
          <FormControlLabel value="circle" control={<Radio />} label="Circle" />
          <FormControlLabel value="rectangle" control={<Radio />} label="Rectangle" />
          <FormControlLabel value="eraser" control={<Radio />} label="Eraser" />
          <FormControlLabel value="text" control={<Radio />} label="Text" />
        </RadioGroup>
        <TextField
          style={{margin:"40px"}}
          label="Drawing Title"
          variant="outlined"
          value={drawingTitle}
          onChange={(e) => setDrawingTitle(e.target.value)}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
        
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
          marginTop: 3,
        }}
      >
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ flexGrow: 1 }}>
          Update drawing
        </Button>

        <Button variant="contained" color="secondary" onClick={() => navigate(-1)} sx={{ flexGrow: 1 }}>
          Back
        </Button>
      </Box>
      <Whiteboard
        shapeType={shapeType}
        onShapesUpdate={handleShapeUpdate}
        isSaved={isSaved}
        shapes={shapes}
        setShapes={setShapes}
        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, padding: 2, marginBottom: 3 }}
      />

     
    </Container>
  );
};

export default DrawingEditPage;
