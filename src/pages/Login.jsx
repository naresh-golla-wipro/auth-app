import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import instance from "../utils/api";
import axios from "axios";
import { useNavigate } from "react-router";
import { useMsal } from "@azure/msal-react";

const Login = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const { token, authProvider, user } = useSelector((state) => state.auth);
  useEffect(() => {
    console.log("token && user",token , user)
    if (token && user) {
      navigate("/home", { replace: true });
    }
  }, [token, user, navigate, authProvider]);


  const handleMicrosoftLogin = async () => {
    try{
    const loginResponse = await instance.loginPopup({
      scopes: ["user.read"],
      prompt: "select_account", // valid prompt values: "login", "none", "conset", "select_account"
    }); // it redirects to microsoft login...
    console.log("logged in...", loginResponse);
    navigate("/home");
    }catch(error){
      // redirect_uri_mismatch is coming directly from Azure AD and is shown before your app regains control. This means: This Catch block will never run  if the redirect URI is wrong. as redirect URI issues, but you cannot programmatically catch this error in
      if (
        error.errorCode === "redirect_uri_mismatch" ||
        (error.message && error.message.includes("redirect_uri"))
      ) {
        alert("Custom Error: The redirect URI is not configured correctly. Please contact support.");
      } else {
        alert("Authentication failed: " + error.message);
      }
    }

  };

  return (
    <div style={styles.container}>
      <button onClick={handleMicrosoftLogin} style={styles.button}>
        Login with Microsoft
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "50px",
  },
  button: {
    marginLeft: "10px",
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Login;
