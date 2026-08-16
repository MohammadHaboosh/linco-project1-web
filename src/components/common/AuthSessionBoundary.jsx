import { useAuthSession } from "../../features/User/hooks/useAuthSession.jsx";
import AppHydrationFallback from "./AppHydrationFallback.jsx";

const AuthSessionBoundary = ({ children }) => {
  const { isInitializing } = useAuthSession();

  if (isInitializing) {
    return <AppHydrationFallback />;
  }

  return children;
};

export default AuthSessionBoundary;
