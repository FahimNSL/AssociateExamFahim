import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import { LinkStyled } from "./styledComponents";


const UserInfo = ({ username }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successful!");
    setTimeout(() => {
      navigate("/"); 
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        right: 5,
        top: 0,
      }}
    >
      <Typography variant="body1" sx={{ marginRight: 1 }}>
        {username}
        <span style={{ fontSize: "0.75rem", color: "blue", marginLeft: "4px" }}>
          ({user?.role})
        </span>
      </Typography>
      <IconButton onClick={handleLogout} color="primary">
        <LogoutIcon />
      </IconButton>
     
        { user.role==="Admin"&& <LinkStyled style={{ position:"absolute",right: 25,
        top: 30,}} to="/register">Create new user</LinkStyled>
       }
    </Box>
  );
};

export default UserInfo;
