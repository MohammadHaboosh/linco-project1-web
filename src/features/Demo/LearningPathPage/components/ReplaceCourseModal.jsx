import { IoCloseOutline, IoBookOutline } from "react-icons/io5";
import styles from "./LearningPath.module.css";
import { useTranslation } from "react-i18next";

const MOCK_DEMO_ASSETS = [
  {
    id: "asset-1",
    title: "UI/UX Foundations",
    desc: "Learn Figma and wireframing.",
    thumbnail: "/images/linco-logo.jpg",
  },
  {
    id: "asset-2",
    title: "Node.js API Development",
    desc: "Build robust backends.",
    thumbnail: "/images/linco-logo.jpg",
  },
];

const ReplaceCourseModal = ({ onClose, onSelectReplacement }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>{t("select-replacement-course")}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalHint}>
            {t(
              "choose-a-course-from-your-demo-assets-to-replace-the-current-one-in-the-path",
            )}
          </p>

          <div className={styles.assetsList}>
            {MOCK_DEMO_ASSETS.map((asset) => (
              <div key={asset.id} className={styles.assetItem}>
                <div className={styles.assetInfo}>
                  <div className={styles.assetIcon}>
                    <IoBookOutline />
                  </div>
                  <div>
                    <h4>{asset.title}</h4>
                    <p>{asset.desc}</p>
                  </div>
                </div>
                <button
                  className={styles.selectBtn}
                  onClick={() => onSelectReplacement(asset)}
                >
                  {t("select")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplaceCourseModal;
