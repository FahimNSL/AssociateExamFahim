import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../Apis/userApiSlice";

import {
  PageContainer,
  Form,
  Title,
  Input,
  Button,
  LinkStyled,
} from "../components/styledComponents";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => {
    // Check if the user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/create-drawing");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password }).unwrap();

      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/create-drawing");
      }, 1000);
    } catch (error) {
      console.error("Login failed", error);
      toast.error(error.data?.message || "Login failed!");
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
      <Form style={{ width: "1000px", marginBottom:"100px" }}>
        <Title>Login</Title>
        <Input
          style={{ width: "auto" }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          style={{ width: "auto" }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <CircularProgress
                size={20}
                style={{ color: "white", marginRight: "10px" }}
              />{" "}
              Processing...
            </>
          ) : (
            "Login"
          )}
        </Button>
        <div style={{ marginTop: "20px" }}>
          <LinkStyled to="/change-password">Change Password?</LinkStyled>
        </div>

      </Form>
    </PageContainer>
  );
};

export default LoginPage;
