// filepath: /Users/na20474551/Desktop/auth-app/src/pages/Logout.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { persistor } from "../app/store";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, instance, inProgress } = useMsal();

  useEffect(() => {
    const handleLogout = async () => {
      dispatch(logout());
      persistor.purge(); //clear persisted store

      localStorage.clear();
      sessionStorage.clear();

      // Clear MSAL cache more aggressively
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("msal.") ||
          key.startsWith("msal.account.keys") ||
          key.startsWith("msal.token.keys") ||
          key.includes(instance.clientId)
        ) {
          console.log("removed key:", key);
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach((key) => {
        if (
          key.startsWith("msal.") ||
          key.startsWith("msal.account.keys") ||
          key.startsWith("msal.token.keys") ||
          key.includes(instance.clientId)
        ) {
          console.log("removed key:", key);
          sessionStorage.removeItem(key);
        }
      });

      if (accounts.length > 0) {
        //Msft
        const logoutRequest = {
          account: accounts[0],
          postLogoutRedirectUri: "http://localhost:5173/",
        };

        if (inProgress === InteractionStatus.None) {
          instance
            .logoutRedirect(logoutRequest)
            .catch((error) => {
              console.error("Logout failed:", error);
            })
            .finally(() => {
              navigate("/login");
            });
        } else {
          console.warn("Logout blocked: Another interaction is in progress");
          navigate("/login");
        }
      } else {
        //Google
        navigate("/login");
      }
    };

    handleLogout();
  }, [dispatch, navigate, accounts, instance, inProgress]);

  return <div>Logging out...</div>; // Or any other loading indicator
};

export default Logout;
