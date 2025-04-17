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

  const handleLogout = async () => {
    localStorage.clear();
    sessionStorage.clear();

    dispatch(logout());
    persistor.purge();

    // Object.keys(localStorage).forEach((key) => {
    //   if (
    //     key.startsWith("msal.") ||
    //     key.startsWith("msal.account.keys") ||
    //     key.startsWith("msal.token.keys") ||
    //     key.includes(instance.getClientId)
    //   ) {
    //     console.log("removed key:", key);
    //     localStorage.removeItem(key);
    //   }
    // });
    if (accounts.length > 0) {
      // MSFT Logout with redirect and error handling
      const logoutRequest = {
        account: accounts[0],
        postLogoutRedirectUri: "http://localhost:5173/", // EXACT MATCH REQUIRED
        // mainWindowRedirectUri: "/",
      };
      // await instance.logoutRedirect({ postLogoutRedirectUri: "/" });
      // await instance.logoutRedirect({ postLogoutRedirectUri: "/" });

      // Check if a login/logout is already in progress
      if (inProgress === InteractionStatus.None) {
        instance.logoutRedirect(logoutRequest).catch((error) => {
          // Optionally, display an error message to the user
          console.log("logout error:", error);
        });
      } else {
        console.warn("logout blocked: Another interaction is in progress");
      }
      // await instance.logoutRedirect(logoutRequest).catch((error) => {
      //   console.error("Logout failed:", error);
      // });
    } else {
      //google
      navigate("/login");
    }
    navigate("/login");
  };

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
