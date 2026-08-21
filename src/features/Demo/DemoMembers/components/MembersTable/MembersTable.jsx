import {
  IoTrashOutline,
  IoShieldCheckmark,
  IoPeopleOutline,
} from "react-icons/io5";
import styles from "./MembersTable.module.css";
import { useTranslation } from "react-i18next";
import MembersTableSkeleton from "./MembersTableSkeleton";

const MembersTable = ({
  members,
  isLoading,
  error,
  deletingMemberId,
  deleteError,
  onRetry,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();

  const normalizeRole = (role) =>
    String(role ?? "")
      .trim()
      .replace(/[\s-]+/g, "_")
      .toUpperCase();

  const getRoleBadge = (role) =>
    normalizeRole(role) === "OWNER" ? (
      <span className={`${styles.badge} ${styles.badgeOwner}`}>
        <IoShieldCheckmark /> {t("owner")}
      </span>
    ) : (
      <span className={`${styles.badge} ${styles.badgeMember}`}>
        {t("member")}
      </span>
    );

  const formatJoinedAt = (joinedAt) => {
    if (!joinedAt) return t("date-not-available");

    const date = new Date(joinedAt);

    if (Number.isNaN(date.getTime())) return t("date-not-available");

    return new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) return <MembersTableSkeleton />;

  return (
    <div
      className={styles.tableWrapper}
      aria-busy={isLoading}
      aria-live="polite"
    >
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
          {deleteError && !error && (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.errorState} role="alert">
                {deleteError}
              </td>
            </tr>
          )}

          {error ? (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.emptyState} role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  className={styles.retryButton}
                  onClick={onRetry}
                >
                  {t("try-again")}
                </button>
              </td>
            </tr>
          ) : members.length === 0 ? (
            <tr className={styles.stateRow}>
              <td colSpan="4" className={styles.emptyState} role="status">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    padding: "30px 0",
                  }}
                >
                  <IoPeopleOutline
                    style={{
                      fontSize: "3rem",
                      color: "var(--app-border-strong)",
                    }}
                  />
                  <strong
                    style={{ color: "var(--app-heading)", fontSize: "1.1rem" }}
                  >
                    {t("no-members-found")}
                  </strong>
                </div>
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
              const mutationInProgress = Boolean(deletingMemberId);

              return (
                <tr key={member.id} className={styles.tableRow}>
                  <td data-label={t("member")}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.imagePath ? (
                          <img
                            src={user.imagePath}
                            alt={t("member-avatar-alt", { name: fullName })}
                          />
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
                  <td data-label={t("role")}>
                    {getRoleBadge(member.role)}
                  </td>
                  <td className={styles.dateText} data-label={t("joined")}>
                    {formatJoinedAt(member.joinedAt)}
                  </td>
                  <td className={styles.actionsCol} data-label={t("actions")}>
                    {!isOwner && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title={
                          isDeleting ? t("removing-member") : t("remove-member")
                        }
                        aria-label={
                          isDeleting
                            ? t("removing-named-member", { name: fullName })
                            : t("remove-named-member", { name: fullName })
                        }
                        onClick={() => onDelete?.(member.id)}
                        disabled={mutationInProgress}
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
