import { useTranslation } from "react-i18next";
import { IoLanguageOutline } from "react-icons/io5";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const isArabic = (i18n.resolvedLanguage || i18n.language || "en").startsWith(
    "ar",
  );

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const switchLabel = isArabic
    ? t("switch-to-english")
    : t("switch-to-arabic");

  return (
    <button
      type="button"
      className={styles.langBtn}
      onClick={toggleLanguage}
      title={switchLabel}
      aria-label={switchLabel}
    >
      <IoLanguageOutline className={styles.icon} aria-hidden="true" />
      <span className={styles.text}>
        {isArabic ? t("english-language-short") : t("arabic-language-name")}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
