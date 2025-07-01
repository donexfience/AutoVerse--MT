import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../redux/store.ts";
import { ReactFlowProvider } from "reactflow";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ReactFlowProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ReactFlowProvider>
    </Provider>
  </StrictMode>
);
