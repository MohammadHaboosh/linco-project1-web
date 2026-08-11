import { useTranslation } from "react-i18next";
import { useAuthSession } from "../../features/User/hooks/useAuthSession.jsx";

const AuthSessionBoundary = ({ children }) => {
  const { t } = useTranslation();
  const { isInitializing } = useAuthSession();

  if (isInitializing) {
    return (
      <div
        className="app-hydration-loading"
        role="status"
        aria-label={t("loading")}
      >
        <span aria-hidden="true" />
      </div>
    );
  }

  return children;
};

export default AuthSessionBoundary;
