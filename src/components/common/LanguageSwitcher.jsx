import { useTranslation } from "react-i18next";
import { IoLanguageOutline } from "react-icons/io5";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      className={styles.langBtn}
      onClick={toggleLanguage}
      title={i18n.language === "en" ? "تغيير إلى العربية" : "Change to English"}
    >
      <IoLanguageOutline className={styles.icon} />
      <span className={styles.text}>
        {i18n.language === "en" ? "عربي" : "EN"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
