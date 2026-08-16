import { IoPersonOutline, IoCalendarOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./ProfileContent.module.css";

const formatBirthDate = (value, locale) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const GeneralTab = ({ profile, firstName, lastName }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const birthDate = formatBirthDate(profile?.birthDate, locale);

  return (
    <section
      className={styles.cardSection}
      aria-labelledby="personal-information-heading"
    >
      <div className={styles.sectionHeader}>
        <h2 id="personal-information-heading">{t("personal-information")}</h2>
        <p>{t("view-your-personal-details")}</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="profile-first-name">{t("first-name")}</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} aria-hidden="true" />
            <input
              id="profile-first-name"
              type="text"
              value={firstName}
              className={styles.input}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-last-name">{t("last-name")}</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} aria-hidden="true" />
            <input
              id="profile-last-name"
              type="text"
              value={lastName || t("not-provided")}
              className={styles.input}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="profile-birth-date">{t("date-of-birth")}</label>
          <div className={styles.inputWrapper}>
            <IoCalendarOutline className={styles.inputIcon} aria-hidden="true" />
            <input
              id="profile-birth-date"
              type="text"
              value={birthDate || t("not-provided")}
              className={styles.input}
              readOnly
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralTab;
