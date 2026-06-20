import styles from "./InvitationCard.module.css";

const InvitationCard = ({ invitation }) => {
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
        <button className={styles["btn-accept"]}>Accept</button>
        <button className={styles["btn-reject"]}>Reject</button>
      </div>
    </div>
  );
};

export default InvitationCard;
