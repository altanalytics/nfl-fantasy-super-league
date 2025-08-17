import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

// Configure REST APIs if they exist in custom section
const existingConfig = Amplify.getConfig();
if (outputs.custom?.API) {
  Amplify.configure({
    ...existingConfig,
    API: {
      REST: {
        ...outputs.custom.API,
      },
    },
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
