import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useMatch,
  redirect,
} from "react-router-dom";
import Login from "./Login";
import "../App.css";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import axios from "axios";
// import instance from "../utils/api";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

function Landing() {
  console.log("Landing");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const authProvider = useSelector((state) => state.auth.authProvider);
  console.log("Landing token, user, authProvider", token, user, authProvider);

  // Handle Msal Login  redirect
  useEffect(() => {
    console.log("instance:", instance);
    const handleMicrosoftLogin = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        console.log("response:handleRedirectPromise=:", response);

        if (response && response.account) {
          const { accessToken, account } = response;
          const {name, username} = account;
          // if (accessToken && account) {
            const userData = {
              name: name || username,
              email: username,
            }
            dispatch(
              setCredentials({
                token: accessToken,
                user: userData,
                authProvider: "microsoft",
              })
            );
            navigate("/home"); // redirect after successful login
          // }
        } else {
          // If no response, try to acquire token silently
          // const accounts = instance.getAllAccounts();
          console.log("MSFT- response:accounts=: else", accounts);
          if (accounts.length > 0) {
            try {
              const silentResponse = await instance.acquireTokenSilent({
                account: accounts[0],
                scopes: ["user.read"],
              });
              // Extract user data from the account object
              console.log("MSFT- silentResponse:", silentResponse);
              const {name, username} = accounts[0];
              const userData = {
                name: name || username,
                email: username,
              };
              dispatch(
                setCredentials({
                  token: silentResponse.accessToken,
                  user: userData,
                  authProvider: "microsoft",
                })
              );
              navigate("/home");
            } catch (silentError) {
              // Handle silent token acquisition error
              console.error("Silent token acquisition error:", silentError);
            }
          }
        }
      } catch (err) {
        console.error("Microsoft login error::", err);
      }
    };
    handleMicrosoftLogin();
  }, [instance, dispatch, navigate, accounts]);

  return (
    <>
      <div>
        <h1>Landing Page</h1>
      </div>
    </>
  );
}

export default Landing;
