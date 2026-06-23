import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useAuthSession } from "./features/User/hooks/useAuthSession.jsx";

const App = () => {
  const { isInitializing } = useAuthSession();

  if (isInitializing) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-linco-navy)",
          color: "white",
        }}
      >
        <h2>Loading LinCo...</h2>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
