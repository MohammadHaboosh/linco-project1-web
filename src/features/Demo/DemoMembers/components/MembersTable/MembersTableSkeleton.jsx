import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import styles from "./MembersTable.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const MembersTableSkeleton = () => {
  const { t } = useTranslation();

  return (
    <ThemeWrapper>
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
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td data-label={t("member")}>
                    <div className={styles.userInfo}>
                      <div
                        className={styles.avatar}
                        style={{ background: "transparent" }}
                      >
                        <Skeleton circle width={40} height={40} />
                      </div>
                      <div className={styles.userDetails}>
                        <Skeleton
                          width={140}
                          height={16}
                          borderRadius={6}
                          style={{ marginBottom: "6px" }}
                        />
                        <Skeleton width={190} height={12} borderRadius={4} />
                      </div>
                    </div>
                  </td>

                  <td data-label={t("role")}>
                    <Skeleton width={85} height={28} borderRadius={20} />
                  </td>

                  <td data-label={t("joined")}>
                    <Skeleton width={95} height={16} borderRadius={6} />
                  </td>

                  <td className={styles.actionsCol} data-label={t("actions")}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Skeleton width={32} height={32} borderRadius={8} />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </ThemeWrapper>
  );
};

export default MembersTableSkeleton;
