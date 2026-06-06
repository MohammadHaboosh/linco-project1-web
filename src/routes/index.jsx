import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import Home from "../pages/HomePage/Home";
import MainLayout from "../layouts/MainLayout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="text-center p-20 text-white text-2xl font-serif">
        الصفحة غير موجودة 404
      </div>
    ),
  },
]);
