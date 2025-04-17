import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import "./App.css";
import { useSelector} from "react-redux";
import Landing from "./pages/Landing";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";


function App() {
  // console.log("app");
  const {token,user} = useSelector((state)=>state.auth)
  console.log("token,user",token,user)
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Landing />} /> {/* this handles redirect */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} /> {/* Add the logout route */}
        <Route path="/home" element={(token  ) ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
