import React, { useState } from "react";
import { useGetAllDrawingsQuery, useDeleteDrawingMutation } from "../Apis/whiteboardApiSlice"; 
import { useGetAllUsersQuery } from "../Apis/userApiSlice";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Pagination,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { drawShapes } from "../components/DrawShapes";
import DrawPageLoader from "../components/DrawPageLoader";
import Swal from "sweetalert2"; // Import SweetAlert

const DrawingListPage = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [page, setPage] = useState(1); 
  const itemsPerPage = 6; 
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all users
  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useGetAllUsersQuery();

  // Fetch drawings based on selected user and pagination
  const { data, error, isLoading, refetch } = useGetAllDrawingsQuery({
    user,
    searchedUser: selectedUser,
    page,
    limit: itemsPerPage,
  });

  // Mutation for deleting a drawing
  const [deleteDrawing] = useDeleteDrawingMutation(); // Use delete mutation

  // Handle user selection change
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setPage(1); 
  };

  const handleEditClick = (whiteboardId) => {
    navigate(`/edit/${whiteboardId}`);
  };

  const handleDeleteClick = (whiteboardId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDrawing(whiteboardId); 
          Swal.fire("Deleted!", "Your drawing has been deleted.", "success");
          refetch(); 
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the drawing.", "error");
        }
      }
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Show loader while data is loading
  if (usersLoading || isLoading) {
    return <DrawPageLoader />;
  }

  if (usersError || error)
    return <Typography color="error">Failed to load data</Typography>;
console.log({data});

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Drawing List
      </Typography>

      {/* User filter bar */}
      {user.role === "Admin" && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Sort User</InputLabel>
          <Select
            value={selectedUser}
            onChange={handleUserChange}
            label="User"
            sx={{ width: "auto" }} 
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {usersData?.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {data?.whiteboards.length === 0 ? (
        <Typography align="center">No drawings found</Typography>
      ) : (
        <>
          <Typography align="center" marginBottom={2}>
            Total Drawings: {data.totalDrawings}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {data.whiteboards.map((whiteboard) => (
              <Grid item xs={12} sm={6} md={4} key={whiteboard._id}>
                <Paper
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {whiteboard.drawingTitle}
                  </Typography>
                  {/* <Typography variant="h6" gutterBottom>
                    {whiteboard._id}
                  </Typography> */}

                  {/* Show the drawing */}
                  <Box
                    sx={{
                      border: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: 200, 
                      backgroundColor: "#f5f5f5",
                      overflow: "hidden",
                      borderRadius: 1,
                    }}
                  >
                    <canvas
                      ref={(canvas) => {
                        if (canvas) {
                          drawShapes(canvas, whiteboard.shapeCoordination);
                        }
                      }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Box>

                  {/* Edit and Delete buttons */}
                  <Box sx={{ marginTop: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => handleEditClick(whiteboard._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteClick(whiteboard._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            <Pagination
              count={data.totalPages} 
              page={page}
              onChange={handlePageChange}
              color="primary"
              siblingCount={1} 
              boundaryCount={2} 
              showFirstButton
              showLastButton 
            />
          </Box>
        </>
      )}
      <Box sx={{ marginBottom: 2 }}>
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default DrawingListPage;
