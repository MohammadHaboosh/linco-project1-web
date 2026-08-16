import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";
import { isChunkLoadError } from "../../utils/chunkLoadRecovery.js";
import styles from "./RouteErrorPage.module.css";

const RouteErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();
  const isOffline =
    typeof navigator !== "undefined" && navigator.onLine === false;
  const isLoadingFailure = isOffline || isChunkLoadError(error);

  return (
    <main className={styles.page}>
      <section className={styles.card} role="alert">
        <img
          className={styles.logo}
          src="/icons/linco-logo-96.webp"
          alt="LinCo"
        />
        <p className={styles.eyebrow}>{t("route-error-eyebrow")}</p>
        <h1>{t("route-error-title")}</h1>
        <p className={styles.message}>
          {isLoadingFailure
            ? t("route-error-network-message")
            : t("route-error-message")}
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => window.location.reload()}>
            {t("reload-page")}
          </button>
          <a href="/">{t("go-to-home")}</a>
        </div>
      </section>
    </main>
  );
};

export default RouteErrorPage;
