import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./AssetCourseCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const AssetCourseCardSkeleton = () => {
  return (
    <ThemeWrapper>
      <article className={styles.card}>
        <div className={styles.imageWrapper}>
          <Skeleton
            height="100%"
            borderRadius={0}
            style={{ display: "block", lineHeight: "1" }}
          />
          <div
            className={styles.readyBadge}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              boxShadow: "none",
            }}
          >
            <Skeleton width={85} height={24} borderRadius={20} />
          </div>
        </div>

        <div className={styles.cardBody}>
          <div
            className={styles.sourceInfo}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              border: "none",
              padding: 0,
              background: "transparent",
            }}
          >
            <Skeleton circle width={16} height={16} />
            <Skeleton width={140} height={14} borderRadius={4} />
          </div>

          <div style={{ margin: "12px 0 8px" }}>
            <Skeleton width="85%" height={22} borderRadius={6} />
          </div>

          <div style={{ marginBottom: "16px", flex: 1 }}>
            <Skeleton
              width="100%"
              height={12}
              borderRadius={4}
              style={{ marginBottom: "6px" }}
            />
            <Skeleton width="65%" height={12} borderRadius={4} />
          </div>

          <div className={styles.actionArea}>
            <Skeleton width="100%" height={42} borderRadius={10} />
          </div>
        </div>
      </article>
    </ThemeWrapper>
  );
};

export default AssetCourseCardSkeleton;
