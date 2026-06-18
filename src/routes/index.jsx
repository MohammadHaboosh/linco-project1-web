import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import HomePage from "../features/HomePage/components/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
