import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./CourseManagementCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const CourseManagementCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Skeleton
            height="100%"
            borderRadius={0}
            style={{ display: "block", lineHeight: "1" }}
          />
        </div>

        <div className={styles.cardBody}>
          <div className={styles.tagsRow}>
            <Skeleton width={56} height={20} borderRadius={6} />
            <Skeleton width={72} height={20} borderRadius={6} />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <Skeleton width="85%" height={22} borderRadius={6} />
          </div>

          <div style={{ marginBottom: "16px", flex: 1 }}>
            <Skeleton
              width="100%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: "6px" }}
            />
            <Skeleton width="75%" height={14} borderRadius={4} />
          </div>

          <div className={styles.statsRow}>
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Skeleton circle width={16} height={16} />
                <Skeleton width={24} height={12} borderRadius={4} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div style={{ flex: 1 }}>
            <Skeleton height={34} borderRadius={10} />
          </div>
          <div style={{ flex: 1 }}>
            <Skeleton height={34} borderRadius={10} />
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};

export default CourseManagementCardSkeleton;
