import {
  IoPlayBack,
  IoPlayForward,
  IoPauseCircle,
  IoSettingsSharp,
  IoExpandOutline,
  IoVolumeHighOutline,
} from "react-icons/io5";
import styles from "./CoursePlayer.module.css";

const VideoPlayer = ({ lessonTitle }) => {
  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoScreen}>
        {/* التدرج اللوني العلوي للعنوان */}
        <div className={styles.videoTopOverlay}>
          <h2 className={styles.videoLessonTitle}>{lessonTitle}</h2>
        </div>

        {/* أزرار التشغيل في المنتصف (تظهر عند التوقف) */}
        <div className={styles.videoCenterControls}>
          <button className={styles.seekBtn}>
            <IoPlayBack />
          </button>
          <button className={styles.mainPlayBtn}>
            <IoPauseCircle />
          </button>
          <button className={styles.seekBtn}>
            <IoPlayForward />
          </button>
        </div>

        {/* شريط التحكم السفلي */}
        <div className={styles.videoBottomOverlay}>
          <div className={styles.videoTimeline}>
            <div
              className={styles.timelinePlayed}
              style={{ width: "45%" }}
            ></div>
            <div className={styles.timelineThumb} style={{ left: "45%" }}></div>
          </div>

          <div className={styles.videoToolbar}>
            <div className={styles.toolbarLeft}>
              <button className={styles.toolBtn}>
                <IoVolumeHighOutline />
              </button>
              <span className={styles.timeDisplay}>06:45 / 15:20</span>
            </div>
            <div className={styles.toolbarRight}>
              <button className={styles.toolBtn}>
                <IoSettingsSharp />
              </button>
              <button className={styles.toolBtn}>
                <IoExpandOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
