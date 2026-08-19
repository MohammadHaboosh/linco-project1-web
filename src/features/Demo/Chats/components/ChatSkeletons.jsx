import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Chats.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

const MeThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="rgba(255, 255, 255, 0.12)"
    highlightColor="rgba(255, 255, 255, 0.25)"
  >
    {children}
  </SkeletonTheme>
);

export const ChatMessagesSkeleton = () => {
  return (
    <ThemeWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--message-row-gap)",
          width: "100%",
          paddingBottom: "20px",
        }}
      >
        <div
          className={`${styles.messageRow} ${styles.rowThem} ${styles["group-single"]}`}
        >
          <div
            className={styles.senderAvatarSmall}
            style={{
              background: "transparent",
              border: "1px solid var(--app-border)",
            }}
          >
            <Skeleton circle width="100%" height="100%" />
          </div>
          <div className={styles.messageContent}>
            <div style={{ marginBottom: "2px", marginInlineStart: "6px" }}>
              <Skeleton width={90} height={10} borderRadius={4} />
            </div>
            <div className={styles.messageBubble}>
              <Skeleton
                width={210}
                height={12}
                count={2}
                style={{ marginBottom: "6px" }}
                borderRadius={4}
              />
              <Skeleton width={140} height={12} borderRadius={4} />
            </div>
          </div>
        </div>

        <div
          className={`${styles.messageRow} ${styles.rowMe} ${styles["group-first"]}`}
          style={{ marginTop: "12px" }}
        >
          <div className={styles.messageContent}>
            <div className={styles.messageBubble}>
              <MeThemeWrapper>
                <Skeleton
                  width={240}
                  height={12}
                  count={2}
                  style={{ marginBottom: "6px" }}
                  borderRadius={4}
                />
                <Skeleton width={80} height={12} borderRadius={4} />
              </MeThemeWrapper>
            </div>
          </div>
        </div>

        <div
          className={`${styles.messageRow} ${styles.rowMe} ${styles["group-last"]}`}
        >
          <div className={styles.messageContent}>
            <div className={styles.messageBubble}>
              <MeThemeWrapper>
                <Skeleton width={160} height={12} borderRadius={4} />
              </MeThemeWrapper>
            </div>
          </div>
        </div>

        <div
          className={`${styles.messageRow} ${styles.rowThem} ${styles["group-single"]}`}
          style={{ marginTop: "12px" }}
        >
          <div
            className={styles.senderAvatarSmall}
            style={{
              background: "transparent",
              border: "1px solid var(--app-border)",
            }}
          >
            <Skeleton circle width="100%" height="100%" />
          </div>
          <div className={styles.messageContent}>
            <div style={{ marginBottom: "2px", marginInlineStart: "6px" }}>
              <Skeleton width={110} height={10} borderRadius={4} />
            </div>
            <div className={styles.messageBubble} style={{ padding: "10px" }}>
              <Skeleton width={250} height={160} borderRadius={10} />
              <div style={{ marginTop: "10px" }}>
                <Skeleton width={180} height={12} borderRadius={4} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.messageRow} ${styles.rowThem} ${styles["group-single"]}`}
          style={{ marginTop: "12px" }}
        >
          <div
            className={styles.senderAvatarSmall}
            style={{
              background: "transparent",
              border: "1px solid var(--app-border)",
            }}
          >
            <Skeleton circle width="100%" height="100%" />
          </div>
          <div className={styles.messageContent}>
            <div style={{ marginBottom: "2px", marginInlineStart: "6px" }}>
              <Skeleton width={80} height={10} borderRadius={4} />
            </div>
            <div className={styles.messageBubble}>
              <div className={styles.replyReference} style={{ border: "none" }}>
                <Skeleton
                  width={70}
                  height={10}
                  style={{ marginBottom: "4px" }}
                />
                <Skeleton width={150} height={10} />
              </div>
              <Skeleton
                width={200}
                height={12}
                count={2}
                borderRadius={4}
                style={{ marginTop: "6px" }}
              />
            </div>
          </div>
        </div>

        <div
          className={`${styles.messageRow} ${styles.rowMe} ${styles["group-single"]}`}
          style={{ marginTop: "12px" }}
        >
          <div className={styles.messageContent}>
            <div className={styles.messageBubble}>
              <MeThemeWrapper>
                <Skeleton width={110} height={12} borderRadius={4} />
              </MeThemeWrapper>
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
};
