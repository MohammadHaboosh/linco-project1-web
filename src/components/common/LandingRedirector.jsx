import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import LandingPage from "../../pages/LandingPage";
import { PATHS } from "../../routes/paths";
import { useAuthSession } from "../../features/User/hooks/useAuthSession.jsx";

const LandingRedirector = ({ locale = "en" }) => {
  useAuthSession();
  const { isAuthenticated } = useUser();

  if (isAuthenticated) {
    return <Navigate to={PATHS.HOME} replace />;
  }

  return <LandingPage locale={locale} />;
};

export default LandingRedirector;
