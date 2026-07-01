import {
  IoPersonOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import styles from "./ProfileContent.module.css";
import { t } from "i18next";

const GeneralTab = ({ profile, firstName, lastName }) => {
  return (
    <div className={styles.cardSection}>
      <div className={styles.sectionHeader}>
        <h2>{t("personal-information")}</h2>
        <p>{t('view-your-personal-details')}</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label>{t("first-name")}</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} />
            <input
              type="text"
              defaultValue={firstName}
              className={styles.input}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>{t("last-name")}</label>
          <div className={styles.inputWrapper}>
            <IoPersonOutline className={styles.inputIcon} />
            <input
              type="text"
              defaultValue={lastName}
              className={styles.input}
              readOnly
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label>{t("date-of-birth")}</label>
          <div className={styles.inputWrapper}>
            <IoCalendarOutline className={styles.inputIcon} />
            <input
              type="date"
              defaultValue={profile?.birthDate?.split("T")[0]}
              className={styles.input}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
