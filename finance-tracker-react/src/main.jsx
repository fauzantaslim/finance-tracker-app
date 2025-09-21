import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/login";
import RegisterPage from "./Pages/register";
import NotFoundPage from "./Pages/404";
import DashboardPage from "./Pages/dashboard";
import { Provider } from "react-redux";
import store from "./redux/store";
const router = createBrowserRouter([
  { path: "/", element: <LoginPage />, errorElement: <NotFoundPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/dashboard", element: <DashboardPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
