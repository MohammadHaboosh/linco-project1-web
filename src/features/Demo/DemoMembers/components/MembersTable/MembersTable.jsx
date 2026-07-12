import {
  IoTrashOutline,
  IoCreateOutline,
  IoShieldCheckmark,
} from "react-icons/io5";
import styles from "./MembersTable.module.css";
import { useTranslation } from "react-i18next";

const MembersTable = ({
  members,
  isLoading,
  error,
  deletingMemberId,
  deleteError,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();

  const normalizeRole = (role) =>
    String(role ?? "")
      .trim()
      .replace(/[\s-]+/g, "_")
      .toUpperCase();

  const getRoleBadge = (role) => {
    switch (normalizeRole(role)) {
      case "OWNER":
        return (
          <span className={`${styles.badge} ${styles.badgeOwner}`}>
            <IoShieldCheckmark /> {t("owner")}
          </span>
        );
      case "SECTION_MANAGER":
      case "SECTIONMANAGER":
      case "MANAGER":
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

  const formatJoinedAt = (joinedAt) => {
    if (!joinedAt) return "-";

    const date = new Date(joinedAt);

    if (Number.isNaN(date.getTime())) return joinedAt;

    return new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t("member")}</th>
            <th>{t("role")}</th>
            <th>{t("joined")}</th>
            <th className={styles.actionsCol}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {deleteError && !isLoading && !error && (
            <tr>
              <td colSpan="4" className={styles.errorState} role="alert">
                {deleteError}
              </td>
            </tr>
          )}
          {isLoading ? (
            <tr>
              <td colSpan="4" className={styles.emptyState}>
                {t("loading-members", "Loading members...")}
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4" className={styles.emptyState}>
                {error}
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.emptyState}>
                {t("no-members-found")}
              </td>
            </tr>
          ) : (
            members.map((member) => {
              const user = member.user ?? {};
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.email ||
                t("member");
              const initials =
                `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
                fullName.charAt(0).toUpperCase();
              const isOwner = normalizeRole(member.role) === "OWNER";
              const isDeleting = deletingMemberId === member.id;

              return (
                <tr key={member.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.imagePath ? (
                          <img src={user.imagePath} alt={fullName} />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className={styles.userDetails}>
                        <span className={styles.userName}>{fullName}</span>
                        <span className={styles.userEmail}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(member.role)}</td>
                  <td className={styles.dateText}>
                    {formatJoinedAt(member.joinedAt)}
                  </td>
                  <td className={styles.actionsCol}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      title={t("edit-role")}
                    >
                      <IoCreateOutline />
                    </button>
                    {!isOwner && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title={
                          isDeleting
                            ? t("removing-member", "Removing member...")
                            : t("remove-member")
                        }
                        onClick={() => onDelete?.(member.id)}
                        disabled={Boolean(deletingMemberId)}
                        aria-busy={isDeleting}
                      >
                        <IoTrashOutline />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembersTable;
