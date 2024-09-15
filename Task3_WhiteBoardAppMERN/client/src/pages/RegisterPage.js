import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../Apis/userApiSlice";
import {
  PageContainer,
  Form,
  Title,
  Label,
  Input,
  Select,
  Button,
  ErrorMessage,
  SuccessMessage,
} from "../components/styledComponents";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const userData = {
      username,
      password,
      role,
    };

    try {
      const response = await createUser(userData).unwrap();
      setSuccess(`User ${response.username} created successfully!`);

      // Redirect after success
      toast.success(`User ${response.username} created successfully!`);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setError(error.data?.message || "Error creating user");
    }
  };

  return (
    <PageContainer style={{
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
      <Form onSubmit={handleSubmit}>
        <Title>Create new user</Title>
        <div>
          <Label>Username:</Label>
          <Input
            style={{ width: "380px" }}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Password:</Label>
          <Input
            style={{ width: "380px" }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Role:</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </Select>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress
                size={20}
                style={{ color: "white", marginRight: "10px" }}
              />{" "}
              Processing...
            </>
          ) : (
            "Register"
          )}
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </Form>
      <hr />
      <Button variant="contained" color="secondary" style={{ width: "400px" }} onClick={() => navigate(-1)}>
        Don't want to register ? Go Back to Previous Page
      </Button>
    </PageContainer>
  );
};

export default RegisterPage;
