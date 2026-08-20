import { useAuthSession } from "../../features/User/hooks/useAuthSession.jsx";
import AppLayoutSkeleton from "../../layouts/AppLayoutSkeleton.jsx";

const AuthSessionBoundary = ({ children }) => {
  const { isInitializing } = useAuthSession();

  if (isInitializing) {
    return <AppLayoutSkeleton />;
  }

  return children;
};

export default AuthSessionBoundary;
