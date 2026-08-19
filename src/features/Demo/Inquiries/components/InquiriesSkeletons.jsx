import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Inquiries.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

export const TraineeInquiriesSkeleton = () => {
  return (
    <ThemeWrapper>
      <div className={styles.ticketsGrid}>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <article key={index} className={styles.ticketCard}>
              <div className={styles.ticketHeader}>
                <Skeleton width={85} height={26} borderRadius={20} />
                <Skeleton width={90} height={14} borderRadius={4} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <Skeleton width="80%" height={22} borderRadius={6} />
              </div>

              <div className={styles.ticketMessage}>
                <Skeleton
                  width={60}
                  height={14}
                  style={{ marginBottom: "8px" }}
                />
                <Skeleton
                  width="100%"
                  height={12}
                  count={2}
                  style={{ marginBottom: "4px" }}
                />
                <Skeleton width="60%" height={12} />
              </div>
            </article>
          ))}
      </div>
    </ThemeWrapper>
  );
};

export const ManagerInboxSkeleton = () => {
  return (
    <ThemeWrapper>
      <div className={styles.inboxLayout}>
        <div className={styles.inboxSidebar}>
          <div className={styles.searchContainer}>
            <Skeleton height={42} borderRadius={100} />
          </div>
          <div className={styles.ticketsList}>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className={styles.inboxItem}>
                  <div className={styles.itemHeader}>
                    <Skeleton width={110} height={16} borderRadius={4} />
                    <Skeleton width={60} height={12} borderRadius={4} />
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <Skeleton width="85%" height={14} borderRadius={4} />
                  </div>
                  <Skeleton width={65} height={22} borderRadius={6} />
                </div>
              ))}
          </div>
        </div>

        <div className={styles.inboxDetail}>
          <div className={styles.detailHeader}>
            <div style={{ marginBottom: "16px" }}>
              <Skeleton width="60%" height={28} borderRadius={6} />
            </div>
            <div className={styles.senderInfo}>
              <Skeleton circle width={42} height={42} />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <Skeleton width={130} height={16} borderRadius={4} />
                <Skeleton width={80} height={12} borderRadius={4} />
              </div>
            </div>
          </div>

          <div className={styles.detailContent} style={{ overflow: "hidden" }}>
            <section className={styles.questionPanel}>
              <Skeleton
                width={70}
                height={14}
                style={{ marginBottom: "12px" }}
              />
              <Skeleton
                width="100%"
                height={12}
                count={3}
                style={{ marginBottom: "6px" }}
              />
              <Skeleton
                width="50%"
                height={12}
                style={{ marginBottom: "16px" }}
              />
              <Skeleton width={90} height={12} />
            </section>
          </div>

          <div className={styles.responseArea}>
            <Skeleton height={90} borderRadius={12} />
            <div className={styles.responseActions}>
              <Skeleton width={140} height={42} borderRadius={12} />
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};
