import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="not-found-page">
      <p>{404}</p>
      <h1>{t("404-page-not-found")}</h1>
      <Link to="/">{t("home")}</Link>
    </main>
  );
};

export default NotFoundPage;
