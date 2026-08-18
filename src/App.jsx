import { RouterProvider } from "react-router-dom";
import { useRoutePreloading } from "./hooks/useRoutePreloading.js";
import { useUser } from "./hooks/useUser.jsx";
import { router } from "./routes/index.jsx";

const App = () => {
  const { isAuthenticated } = useUser();
  useRoutePreloading(isAuthenticated);

  return <RouterProvider router={router} />;
};

export default App;
