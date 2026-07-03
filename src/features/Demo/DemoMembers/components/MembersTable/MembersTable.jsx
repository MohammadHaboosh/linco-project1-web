import {
  IoTrashOutline,
  IoCreateOutline,
  IoShieldCheckmark,
} from "react-icons/io5";
import styles from "./MembersTable.module.css";
import { useTranslation } from "react-i18next";

const MembersTable = ({ members, onDelete }) => {
  const { t } = useTranslation();

  const getRoleBadge = (role) => {
    switch (role) {
      case "owner":
        return (
          <span className={`${styles.badge} ${styles.badgeOwner}`}>
            <IoShieldCheckmark /> {t("owner")}
          </span>
        );
      case "sectionManager":
        return (
          <span className={`${styles.badge} ${styles.badgeManager}`}>
            {t("manager")}
          </span>
        );
      default:
        return (
          <span className={`${styles.badge} ${styles.badgeTrainee}`}>
            {t("trainee")}
          </span>
        );
    }
  };

  const getStatusDot = (status) => {
    if (status === "Active")
      return (
        <span className={`${styles.statusDot} ${styles.dotActive}`}></span>
      );
    if (status === "Invited")
      return (
        <span className={`${styles.statusDot} ${styles.dotPending}`}></span>
      );
    return <span className={`${styles.statusDot} ${styles.dotOffline}`}></span>;
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("member")}</th>
            <th>{t("role")}</th>
            <th>{t("status")}</th>
            <th>{t("joined")}</th>
            <th className={styles.actionsCol}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.emptyState}>
                {t("no-members-found")}
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <tr key={member.id} className={styles.tableRow}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} />
                      ) : (
                        <span>{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{member.name}</span>
                      <span className={styles.userEmail}>{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(member.role)}</td>
                <td>
                  <div className={styles.statusWrapper}>
                    {getStatusDot(member.status)} {member.status}
                  </div>
                </td>
                <td className={styles.dateText}>{member.joinedAt}</td>
                <td className={styles.actionsCol}>
                  <button className={styles.actionBtn} title={t("edit-role")}>
                    <IoCreateOutline />
                  </button>
                  {member.role !== "owner" && (
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title={t("remove-member")}
                      onClick={() => onDelete(member.id)}
                    >
                      <IoTrashOutline />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
