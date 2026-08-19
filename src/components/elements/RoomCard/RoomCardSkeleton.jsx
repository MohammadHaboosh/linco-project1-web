import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./RoomCard.module.css";

const RoomCardSkeleton = () => {
  return (
    <SkeletonTheme
      baseColor="var(--app-surface-soft)"
      highlightColor="var(--app-border)"
    >
      <div className={styles.card} style={{ cursor: "default" }}>
        <div className={styles.cardHeader}>
          <div className={styles.brandSection}>
            <div
              className={styles.logoBox}
              style={{
                border: "1px solid var(--app-border)",
                background: "transparent",
              }}
            >
              <Skeleton circle width="100%" height="100%" />
            </div>
            <div
              className={styles.titleBox}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Skeleton
                width={130}
                height={18}
                borderRadius={6}
                style={{ marginBottom: "6px" }}
              />
              <Skeleton width={70} height={14} borderRadius={4} />
            </div>
          </div>

          <div className={styles.badgeSection}>
            <Skeleton width={75} height={26} borderRadius={20} />
          </div>
        </div>

        <div className={styles.cardBody}>
          <Skeleton
            width="100%"
            height={14}
            borderRadius={4}
            style={{ marginBottom: "6px" }}
          />
          <Skeleton width="75%" height={14} borderRadius={4} />
        </div>

        <hr className={styles.divider} />

        <div
          className={styles.cardFooter}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className={styles.footerItem}>
            <Skeleton circle width={16} height={16} />
            <Skeleton width={50} height={14} borderRadius={4} />
          </div>
          <div className={styles.footerItem}>
            <Skeleton circle width={10} height={10} />
            <Skeleton width={60} height={14} borderRadius={4} />
          </div>
          <div className={styles.footerItem}>
            <Skeleton circle width={16} height={16} />
            <Skeleton width={70} height={14} borderRadius={4} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default RoomCardSkeleton;
