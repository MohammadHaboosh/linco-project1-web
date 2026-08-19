import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import {
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoBriefcaseOutline,
} from "react-icons/io5";
import styles from "./DepartmentMembersContent.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

export const SummaryCardsSkeleton = () => {
  const { t } = useTranslation();
  return (
    <ThemeWrapper>
      <section className={styles.summaryGrid} aria-hidden="true">
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <IoPeopleOutline />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "var(--app-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
              }}
            >
              {t("total-members", "Total members")}
            </span>
            <Skeleton width={60} height={22} borderRadius={6} />
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <IoShieldCheckmarkOutline />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "var(--app-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
              }}
            >
              {t("management-roles")}
            </span>
            <Skeleton width={60} height={22} borderRadius={6} />
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <IoBriefcaseOutline />
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: "var(--app-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "block",
              }}
            >
              {t("job-levels")}
            </span>
            <Skeleton width={60} height={22} borderRadius={6} />
          </div>
        </div>
      </section>
    </ThemeWrapper>
  );
};

export const MembersTableSkeleton = () => {
  const { t } = useTranslation();
  return (
    <ThemeWrapper>
      <div className={styles.tableScroller}>
        <table className={styles.membersTable}>
          <thead>
            <tr>
              <th>{t("member")}</th>
              <th>{t("job-title")}</th>
              <th>{t("workspace-role")}</th>
              <th>{t("assigned")}</th>
              <th className={styles.actionsColumn}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <tr key={index}>
                  <td data-label={t("member")}>
                    <div className={styles.memberIdentity}>
                      <div
                        className={styles.avatar}
                        style={{
                          background: "transparent",
                          border: "1px solid var(--app-border)",
                        }}
                      >
                        <Skeleton circle width="100%" height="100%" />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <Skeleton width={140} height={14} borderRadius={4} />
                        <Skeleton width={190} height={12} borderRadius={4} />
                      </div>
                    </div>
                  </td>
                  <td data-label={t("job-title")}>
                    <Skeleton width={90} height={18} borderRadius={6} />
                  </td>
                  <td data-label={t("workspace-role")}>
                    <Skeleton width={80} height={26} borderRadius={20} />
                  </td>
                  <td className={styles.dateCell} data-label={t("assigned")}>
                    <Skeleton width={85} height={14} borderRadius={6} />
                  </td>
                  <td
                    className={styles.actionsColumn}
                    data-label={t("actions")}
                  >
                    <Skeleton width={36} height={36} borderRadius={8} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </ThemeWrapper>
  );
};
