// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./store";

import LoginPage from "./pages/LoginPage";
import CreateDrawingPage from "./pages/CreateDrawingPage";
import DrawingListPage from "./pages/DrawingListPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DrawingEditPage from "./pages/DrawingEditPage";
import UserPage from "./pages/UsersPage";

const App = () => (
  <Provider store={store}>
   
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route
            path="/create-drawing"
            element={<CreateDrawingPage />}
          />
          <Route
            path="/drawing-list"
            element={<DrawingListPage />}
          />
          <Route path="/edit/:id" element={<DrawingEditPage />} />
          <Route path="/user-list" element={<UserPage />} />
        </Routes>
        <ToastContainer />
      </Router>
  
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
