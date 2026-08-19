import { useAuthSession } from "../../features/User/hooks/useAuthSession.jsx";
import AppLayoutSkeleton from "../../layouts/AppLayoutSkeleton.jsx";
import useMinimumLoader from "../../hooks/useMinimumLoader.js";

const AuthSessionBoundary = ({ children }) => {
  const { isInitializing } = useAuthSession();
  const shouldShowLoader = useMinimumLoader(isInitializing, 2000);

  if (shouldShowLoader) {
    return <AppLayoutSkeleton />;
  }

  return children;
};

export default AuthSessionBoundary;
