import { useTranslation } from "react-i18next";

const AppHydrationFallback = () => {
  const { t } = useTranslation();

  return (
    <div
      className="app-hydration-loading"
      role="status"
      aria-label={t("loading")}
    >
      <span aria-hidden="true" />
    </div>
  );
};

export default AppHydrationFallback;
