import React, { useState } from "react";
import { useCreateDrawMutation } from "../Apis/whiteboardApiSlice";
import Whiteboard from "../components/Whiteboard";
import UserInfo from "../components/UserInfo";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  useTheme,
  RadioGroup, FormControlLabel, Radio,
  useMediaQuery,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const CreateDrawingPage = () => {
  const [drawingTitle, setDrawingTitle] = useState("");
  const [shapeType, setShapeType] = useState("line");
  const [shapeCoordination, setShapeCoordination] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [createDraw, { isLoading, isError, isSuccess }] = useCreateDrawMutation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is small

  const user = JSON.parse(localStorage.getItem("user"));

  const handleShapeUpdate = (newShapes) => {
    setShapeCoordination(newShapes);
  };

  const handleSaveDrawing = async () => {
    if (!drawingTitle) {
      Swal.fire("Error!", "Please enter a drawing title.", "error");
      return;
    }
    if (shapeCoordination.length === 0) {
      Swal.fire("Error!", "Please draw something before saving.", "error");
      return;
    }
    const userId = user._id;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this drawing?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    });

    if (result.isConfirmed) {
      try {
        await createDraw({
          drawingTitle,
          shapeType,
          shapeCoordination,
          userId,
        }).unwrap();
        setIsSaved(true);
        setDrawingTitle("");
        Swal.fire("Saved!", "Your drawing has been saved.", "success");
      } catch (error) {
        console.error("Error saving drawing:", error);
        Swal.fire("Error!", "There was an error saving your drawing.", "error");
      }
    }
  };

  const handleShowDrawings = () => {
    navigate("/drawing-list");
  };

  const handleShowUsers = () => {
    navigate("/user-list");
  };
  const iconUrl = 'https://as2.ftcdn.net/v2/jpg/02/00/01/13/1000_F_200011327_6OtdB3lwPgDzNgtFotfb8ZwDYGKr9R06.jpg';

  return (


      <Container
        maxWidth="lg"
        sx={{
          padding: 2,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* User Info Component */}
        {user && <UserInfo username={user.username} />}
        <Box display="flex" alignItems="center">
          <img src={iconUrl} alt="icon" style={{ width: 35, height: 35, marginRight: 8 }} />
          <Typography variant="h5" gutterBottom>
            Create Drawing
          </Typography>

        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 2,
            marginBottom: 2,
            width: "100%",
            maxWidth: 600,
          }}
        >
          <RadioGroup
            row
            value={shapeType}
            onChange={(e) => setShapeType(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: isSmallScreen ? "100%" : 500 }} 
          >
            <FormControlLabel value="line" control={<Radio />} label="Line" />
            <FormControlLabel value="circle" control={<Radio />} label="Circle" />
            <FormControlLabel value="rectangle" control={<Radio />} label="Rectangle" />
            <FormControlLabel value="eraser" control={<Radio />} label="Eraser" />
            <FormControlLabel value="text" control={<Radio />} label="Text" />
          </RadioGroup>

          <TextField
          style={{margin:"20px"}}
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
            width: "100%",
            maxWidth: 600,
          }}
        >

          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleShowDrawings}
            sx={{ flexGrow: 1 }}
          >
            Show Drawings
          </Button>
          {user.role === "Admin" && <Button
            variant="contained"
            color="info"
            size="small"
            onClick={handleShowUsers}
            sx={{ flexGrow: 1 }}
          >
            Show Users
          </Button>}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSaveDrawing}
            disabled={isLoading}
            sx={{ flexGrow: 1 }}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Box>

        {isError && <Typography color="error">Error saving drawing</Typography>}
        {isSuccess && (
          <Typography color="success">Drawing saved successfully</Typography>
        )}

        <Whiteboard
          shapeType={shapeType}
          onShapesUpdate={handleShapeUpdate}
          isSaved={isSaved}
          shapes={shapes}
          setShapes={setShapes}
        />

      </Container>
   
  );
};

export default CreateDrawingPage;
