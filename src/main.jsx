import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./app/store";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import "./index.css";
import App from "./App.jsx";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID
    }`,
    redirectUri: "http://localhost:5173/",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  // system: {
  //   loggerOptions: {
  //     loggerCallback: (level, message, containsPii) => {
  //       if (containsPii) {
  //         return;
  //       }
  //       switch (level) {
  //         case msal.LogLevel.Error:
  //           console.error(message);
  //           return;
  //         case msal.LogLevel.Info:
  //           console.info(message);
  //           return;
  //         case msal.LogLevel.Verbose:
  //           console.debug(message);
  //           return;
  //         case msal.LogLevel.Warning:
  //           console.warn(message);
  //           return;
  //       }
  //     },
  //     piiLoggingEnabled: false,
  //   },
  // },
  // AccessTokenScopes: [`api://${import.meta.env.VITE_AZURE_CLIENT_ID}/user_read`, "User.Read"], // updated
};

const msalInstance = new PublicClientApplication(msalConfig);
async function initializeMsal() {
  await msalInstance.initialize();
}
initializeMsal()
  .then(() => {
    renderApp();
  })
  .catch((error) => {
    console.error("MSAL initialization error:", error);
  });

function renderApp() {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MsalProvider instance={msalInstance}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MsalProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
