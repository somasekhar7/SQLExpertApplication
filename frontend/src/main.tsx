import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store"; // ✅ Make sure this path is correct

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
