import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";
import AppAlertProvider from "./components/common/AppAlerts/AppAlertProvider.jsx";

const App = () => (
  <AppAlertProvider>
    <RouterProvider router={router} />
  </AppAlertProvider>
);

export default App;
