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
import { fetchUser, setCredentials } from "../features/auth/authSlice";
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

  // get which OauthProvider

  // Handle Microsoft Login Redirect
  {
    /* 
  useEffect(() => {
    console.log("instance:", instance);
    const handleMicrosoftLogin = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        console.log("response:handleRedirectPromise=:", response);

        if (response) {
          const { accessToken, account } = response;
          console.log("MSFT- accessToken, account, try: if", accessToken, account);
          if (accessToken && account) {
            dispatch(
              setCredentials({
                token: accessToken,
                user: {
                  name: account.name || account.username,
                  email: account.username,
                  authProvider: "microsoft",
                },
              })
            );

            navigate("/home"); // redirect after successful login
          }
        } else {
          const accounts = instance.getAllAccounts();
          console.log("MSFT- response:accounts=: else", accounts);
          if (accounts.length > 0) {
            const silentResponse = await instance.acquireTokenSilent({
              account: accounts[0],
              scopes: ["user.read"],
            });
            console.log("MSFT- accessToken, account, else:", accounts);
            console.log("MSFT- silentResponse:", silentResponse);
            if (silentResponse.accessToken) {
              dispatch(
                setCredentials({
                  token: silentResponse.accessToken,
                  user: {
                    name: accounts[0].name || accounts[0].username,
                    email: accounts[0].username,
                    authProvider: "microsoft",
                  },
                })
              );
              navigate("/home");
            }
          }
        }
      } catch (err) {
        console.error("Microsoft login error::", err);
      }
    };
    handleMicrosoftLogin();
  }, [instance, dispatch, navigate]);
    */
  }
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

  // Handle Google Login  redirect
  useEffect(() => {
    // const code = searchParams.getCode
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      // const provider = urlParams.get("provider");
      const urlToken = urlParams.get("token");
      const provider = urlParams.get("provider");

      if (urlToken) {
        dispatch(
          setCredentials({
            token: urlToken,
            user: null,
            authProvider: provider,
          })
        );
        // now fetch user using token
        if (provider === "google") {
          await dispatch(fetchUser()).then(() => {
            navigate("/home");
          });
        }
      }
    };
    handleGoogleRedirect();
  }, [dispatch, navigate, token, user]);

  return (
    <>
      <div>
        <h1>Landing Page</h1>
      </div>
    </>
  );
}

export default Landing;
