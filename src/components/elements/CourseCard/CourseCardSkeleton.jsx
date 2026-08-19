import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./CourseCard.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const CourseCardSkeleton = ({ isOwner }) => {
  return (
    <ThemeWrapper>
      <article className={styles.card}>
        <div className={styles.imageContainer}>
          <Skeleton
            height="100%"
            borderRadius={0}
            style={{ display: "block", lineHeight: "1" }}
          />
          {isOwner && (
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                zIndex: 2,
              }}
            >
              <Skeleton width={70} height={24} borderRadius={12} />
            </div>
          )}
        </div>

        <div className={styles.cardBody}>
          <div className={styles.header} style={{ marginBottom: "8px" }}>
            <Skeleton width="85%" height={24} borderRadius={6} />
            {isOwner && <Skeleton width={32} height={32} borderRadius={8} />}
          </div>

          <div style={{ marginBottom: "16px", flex: 1 }}>
            <Skeleton
              width="100%"
              height={14}
              style={{ marginBottom: "6px" }}
              borderRadius={4}
            />
            <Skeleton width="60%" height={14} borderRadius={4} />
          </div>

          <div className={styles.metaContainer}>
            <div className={styles.metaTags}>
              <Skeleton width={75} height={26} borderRadius={12} />
              <Skeleton width={85} height={26} borderRadius={12} />
            </div>
            {isOwner && <Skeleton width={80} height={32} borderRadius={8} />}
          </div>

          <div className={styles.spacer}></div>

          {isOwner ? (
            <div className={styles.ownerFooter}>
              <div className={styles.statsGrid}>
                <Skeleton width={70} height={16} borderRadius={4} />
                <Skeleton width={80} height={16} borderRadius={4} />
              </div>
              <div className={styles.lastUpdated}>
                <Skeleton width={130} height={12} borderRadius={4} />
              </div>
            </div>
          ) : (
            <div className={styles.traineeFooter}>
              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <Skeleton width={50} height={14} borderRadius={4} />
                  <Skeleton width={35} height={14} borderRadius={4} />
                </div>
                <Skeleton width="100%" height={8} borderRadius={4} />
              </div>
              <Skeleton width="100%" height={44} borderRadius={12} />
            </div>
          )}
        </div>
      </article>
    </ThemeWrapper>
  );
};

export default CourseCardSkeleton;
