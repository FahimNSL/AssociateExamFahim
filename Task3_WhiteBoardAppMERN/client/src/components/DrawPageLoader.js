import React from "react";
import { Box, CircularProgress, Grid, Paper, Skeleton } from "@mui/material";

const DrawPageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // Adjust the height to vertically center the spinner
        flexDirection: "column",
      }}
    >
      <CircularProgress />

      {/* Display skeletons while loading */}
      <Box mt={2} sx={{ width: "100%", maxWidth: 1200 }}>
        <Grid container spacing={3}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Skeleton variant="text" height={40} />
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" height={20} width="60%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DrawPageLoader;
