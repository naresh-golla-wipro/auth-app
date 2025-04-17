import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { persistor } from "../app/store";
import { InteractionStatus } from "@azure/msal-browser";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, instance, inProgress } = useMsal();
  const { token, user } = useSelector((state) => state.auth);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogOut = () => {
    navigate("/logout");
  };


  return (
    <div style={styles.header}>
      {token && user ? (
        <>
          <div style={styles.info}>
            <span>Welcome, {user.name}</span>
            <button onClick={handleLogOut} style={styles.button}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <p>Please login to </p>
          <button onClick={handleLogin} style={styles.button}>
            Sign In
          </button>
        </>
      )}
    </div>
  );
};
const styles = {
  header: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ccc",
  },
  info: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
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
export default Header;
