import { useTranslation } from "react-i18next";
import styles from "./InvitationCard.module.css";

const InvitationCard = ({ invitation }) => {
  const { t } = useTranslation();

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
