import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { hydrateBasicTokenFromSession } from "./api/client";

hydrateBasicTokenFromSession();
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
