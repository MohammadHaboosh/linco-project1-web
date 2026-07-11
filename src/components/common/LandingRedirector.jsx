import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import LandingPage from "../../pages/LandingPage";
import { PATHS } from "../../routes/paths";

const LandingRedirector = () => {
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <LandingPage />;
};

export default LandingRedirector;
