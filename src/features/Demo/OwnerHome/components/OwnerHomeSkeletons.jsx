import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import styles from "../OwnerHomeContent.module.css";

export const StatsOverviewSkeleton = () => {
  return (
    <div className={styles.statsGrid}>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <article key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statInfo}>
                <Skeleton width={110} height={14} borderRadius={6} />
                <Skeleton
                  width={80}
                  height={36}
                  borderRadius={8}
                  style={{ marginTop: "8px" }}
                />
              </div>
              <Skeleton width={48} height={48} borderRadius={14} />
            </div>
            <div className={styles.statFooter} style={{ marginTop: "12px" }}>
              <Skeleton width={160} height={14} borderRadius={6} />
            </div>
          </article>
        ))}
    </div>
  );
};

export const TopDepartmentsSkeleton = () => {
  return (
    <div className={styles.departmentsCard}>
      <div className={styles.cardHeader}>
        <Skeleton width={220} height={24} borderRadius={8} />
      </div>
      <div className={styles.departmentsList}>
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className={styles.deptItem}>
              <Skeleton width={48} height={48} borderRadius={14} />
              <div className={styles.deptMainContent}>
                <div className={styles.deptInfo}>
                  <Skeleton width={150} height={18} borderRadius={6} />
                  <div style={{ marginTop: "6px" }}>
                    <Skeleton width={90} height={14} borderRadius={6} />
                  </div>
                </div>
                <div className={styles.deptProgress}>
                  <div className={styles.progressHeader}>
                    <Skeleton width={60} height={14} borderRadius={4} />
                    <Skeleton width={30} height={14} borderRadius={4} />
                  </div>
                  <Skeleton width="100%" height={8} borderRadius={4} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const ReportMembersListSkeleton = () => {
  return (
    <div className={styles.membersCard}>
      <div className={styles.cardHeader}>
        <Skeleton width={180} height={24} borderRadius={8} />
      </div>
      <div className={styles.activityList}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className={styles.activityItem}
              style={{ padding: "8px", marginInlineStart: "-8px" }}
            >
              <Skeleton
                width={48}
                height={48}
                borderRadius={12}
                style={{ flexShrink: 0 }}
              />
              <div className={styles.activityDetails} style={{ width: "100%" }}>
                <div style={{ marginBottom: "8px" }}>
                  <Skeleton width={160} height={16} borderRadius={6} />
                </div>
                <div className={styles.memberMetrics}>
                  <Skeleton width={110} height={24} borderRadius={20} />
                  <Skeleton width={130} height={24} borderRadius={20} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const ReportCoursesTableSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <Skeleton width={36} height={36} borderRadius={10} />
          <div style={{ marginInlineStart: "12px" }}>
            <Skeleton width={200} height={24} borderRadius={8} />
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>{t("course-title")}</th>
              <th className={styles.centerCell}>{t("assigned-members")}</th>
              <th className={styles.centerCell}>{t("attempts")}</th>
              <th className={styles.centerCell}>{t("avg-score")}</th>
              <th className={styles.centerCell}>{t("certifications")}</th>
            </tr>
          </thead>
          <tbody>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.courseCell}>
                      <Skeleton
                        width={42}
                        height={42}
                        borderRadius={12}
                        style={{ flexShrink: 0 }}
                      />
                      <Skeleton width={180} height={16} borderRadius={6} />
                    </div>
                  </td>
                  <td className={styles.centerCell}>
                    <Skeleton width={40} height={16} borderRadius={4} />
                  </td>
                  <td className={styles.centerCell}>
                    <Skeleton width={40} height={16} borderRadius={4} />
                  </td>
                  <td className={styles.centerCell}>
                    <Skeleton width={60} height={28} borderRadius={8} />
                  </td>
                  <td className={styles.centerCell}>
                    <Skeleton width={50} height={24} borderRadius={20} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
