import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import listStyles from "./LeaderboardList.module.css";
import podiumStyles from "./LeaderboardPodium.module.css";

const ThemeWrapper = ({ children }) => (
  <SkeletonTheme
    baseColor="var(--app-surface-soft)"
    highlightColor="var(--app-border)"
  >
    {children}
  </SkeletonTheme>
);

export const LeaderboardListSkeleton = () => {
  const { t } = useTranslation();
  return (
    <ThemeWrapper>
      <div className={listStyles.listWrapper}>
        <div className={listStyles.columnHeader} aria-hidden="true">
          <span>{t("leaderboard-rank-column")}</span>
          <span>{t("leaderboard-member-column")}</span>
          <span>{t("leaderboard-role-column")}</span>
          <span>{t("leaderboard-level-column")}</span>
          <span>{t("leaderboard-points-column")}</span>
        </div>
        <ol className={listStyles.rankingList}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <li key={index} className={listStyles.rowCard}>
                <div className={listStyles.rankCol}>
                  <Skeleton width={34} height={34} borderRadius={10} />
                </div>

                <div className={listStyles.nameCol}>
                  <div className={listStyles.memberProfile}>
                    <div
                      className={listStyles.avatarWrapper}
                      style={{ border: "none", background: "transparent" }}
                    >
                      <Skeleton circle width={42} height={42} />
                    </div>
                    <Skeleton width={130} height={16} borderRadius={4} />
                  </div>
                </div>

                <div className={listStyles.detailsCol}>
                  <div className={listStyles.roleCol}>
                    <Skeleton width={70} height={14} borderRadius={4} />
                  </div>
                  <div className={listStyles.levelCol}>
                    <Skeleton width={60} height={14} borderRadius={4} />
                  </div>
                </div>

                <div
                  className={listStyles.xpCol}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Skeleton width={50} height={18} borderRadius={4} />
                </div>
              </li>
            ))}
        </ol>
      </div>
    </ThemeWrapper>
  );
};

export const LeaderboardPodiumSkeleton = () => {
  const podiumOrder = [{ rank: 2 }, { rank: 1 }, { rank: 3 }];

  return (
    <ThemeWrapper>
      <ol className={podiumStyles.podiumWrapper}>
        {podiumOrder.map((user, index) => (
          <li
            key={index}
            className={`${podiumStyles.podiumCol} ${podiumStyles[`rank${user.rank}`]}`}
          >
            <div
              className={podiumStyles.podiumAvatar}
              style={{
                border: "none",
                background: "transparent",
                boxShadow: "none",
              }}
            >
              <Skeleton
                circle
                width={user.rank === 1 ? 76 : 60}
                height={user.rank === 1 ? 76 : 60}
              />
            </div>

            <div
              className={podiumStyles.medalBadge}
              style={{
                border: "none",
                background: "transparent",
                boxShadow: "none",
              }}
            >
              <Skeleton
                circle
                width={user.rank === 1 ? 44 : 36}
                height={user.rank === 1 ? 44 : 36}
              />
            </div>

            <div className={podiumStyles.podiumBlock}>
              <Skeleton width={40} height={40} style={{ opacity: 0.15 }} />
            </div>

            <div className={podiumStyles.userInfo}>
              <div style={{ marginBottom: "6px" }}>
                <Skeleton width={80} height={16} borderRadius={4} />
              </div>
              <Skeleton width={50} height={22} borderRadius={10} />
            </div>
          </li>
        ))}
      </ol>
    </ThemeWrapper>
  );
};
