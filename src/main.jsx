import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./scss/style.scss";
import { BrowserRouter } from "react-router-dom";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import StateProvider from "./context/StateContext.jsx";

import { Provider } from "react-redux";
import { store } from "./services/store.js";

//skeleton css
import "react-loading-skeleton/dist/skeleton.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <Provider store={store}>
    <BrowserRouter>
      <StateProvider>
        <App />
      </StateProvider>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
