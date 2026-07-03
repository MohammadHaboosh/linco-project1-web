import { useTranslation } from "react-i18next";
import { IoTimeOutline } from "react-icons/io5";
import styles from "./InvitationCard.module.css";

const InvitationCard = ({ invitation, compact = false }) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className={`${styles["list-item"]} ${styles["compact-card"]}`}>
        <div className={styles["compact-header"]}>
          <span className={styles["company-name"]}>{invitation.company}</span>
          <span className={styles["compact-time"]}>
            <IoTimeOutline
              style={{ marginBottom: "-2px", marginRight: "4px" }}
            />
            {invitation.time}
          </span>
        </div>

        <div className={styles["compact-details"]}>
          <span className={styles["compact-caller"]}>
            {t("from")}: {invitation.caller}
          </span>
          <span className={styles["compact-role"]}>{invitation.role}</span>
        </div>

        <div
          className={`${styles["list-actions"]} ${styles["compact-actions"]}`}
        >
          <button className={styles["btn-accept"]}>{t("accept")}</button>
          <button className={styles["btn-reject"]}>{t("reject")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["list-item"]}>
      <div className={styles["company-name"]}>{invitation.company}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.caller}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.role}</div>
      <div className={styles["vertical-divider"]}></div>
      <div className={styles["text-item"]}>{invitation.time}</div>

      <div className={styles["list-actions"]}>
        <button className={styles["btn-accept"]}>{t("accept")}</button>
        <button className={styles["btn-reject"]}>{t("reject")}</button>
      </div>
    </div>
  );
};

export default InvitationCard;
