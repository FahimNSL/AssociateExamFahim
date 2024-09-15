import React, { useState } from "react";
import { useUpdatePasswordMutation } from "../Apis/userApiSlice"; // Adjust the path as necessary
import {
  PageContainer,
  Form,
  Title,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
} from "../components/styledComponents";
import CircularProgress from "@mui/material/CircularProgress"; // Import the MUI spinner
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [changePassword, { isLoading }] = useUpdatePasswordMutation();
  const [userName, setUserName] = useState("");

  const handleChangePassword = async () => {
    try {
      setError("");
      setSuccess("");

      await changePassword({ currentPassword, newPassword, userName }).unwrap();
      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      navigate("/");
    } catch (error) {
      setError(
        error.data?.message || "Error changing password. Please try again."
      );
    }
  };

  return (
    <PageContainer
      style={{
        backgroundImage: `url('https://img.freepik.com/premium-photo/hand-holding-warning-sign-with-word-ai-holographic-text-against-dark-background_778772-3774.jpg?w=826')`,
        backgroundSize: '55%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <div style={{ marginTop: "-100px" }}>
        <h1>Whiteboard Application</h1>
      </div>
      <Form style={{ marginBottom: "50px" }} onSubmit={(e) => e.preventDefault()}>
        <Title>Change Password</Title>
        <Input
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button onClick={handleChangePassword} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress
                size={20}
                style={{ color: "white", marginRight: "10px" }}
              />{" "}
              Processing...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Form>

      <Button variant="contained" color="secondary" style={{ width: "400px" }} onClick={() => navigate(-1)}>
        Don't want to Change ? Go Back to Previous Page
      </Button>
      
    </PageContainer>
  );
};

export default ChangePasswordPage;
