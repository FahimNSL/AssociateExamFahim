import React from "react";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../Apis/userApiSlice";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserPage = () => {
  const { data: usersData, error: usersError, isLoading: usersLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId);
          Swal.fire("Deleted!", "The user has been deleted.", "success");
          refetch();  // Refetch users list
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the user.", "error");
        }
      }
    });
  };
  
  if (usersLoading) return <CircularProgress />;
  if (usersError) return <Typography color="error">Error loading users</Typography>;
   const backgroundImageUrl = 'https://img.freepik.com/free-photo/young-person-presenting-empty-copyspace_1048-17440.jpg?t=st=1726384119~exp=1726387719~hmac=92c990aeae2407f115303f349f515adea4311d7b407640404a69a617870e8373&w=1380'

   return (
    <Box
    
      sx={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Avoid repeating the image
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="lg">
        <Typography style={{ justifyContent: "center", alignItems: "center", display: "flex" }} variant="h2" gutterBottom>
          User List
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2 // Margin bottom for spacing
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 500,
              overflowY: 'auto',
              boxShadow: 3,
              marginTop: "100px"
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell> {/* Action column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(user._id)} // Delete button with confirmation
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UserPage;
