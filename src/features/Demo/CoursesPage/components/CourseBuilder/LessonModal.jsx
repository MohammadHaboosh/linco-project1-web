import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCloseOutline, IoSaveOutline } from "react-icons/io5";
import { GeneralTab, VideoTab, AITab } from "./LessonTabs"; // استدعاء التبويبات
import styles from "./LessonModal.module.css";

const LessonModal = ({ onClose, onSave, defaultData }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [lessonData, setLessonData] = useState(
    defaultData || {
      title: "",
      description: "",
      duration: "",
      videoUrl: "",
      aiEndpoint: "",
      aiPrompt: "",
    },
  );

  const handleChange = (field, value) =>
    setLessonData((prev) => ({ ...prev, [field]: value }));

  const tabs = [
    { id: "general", label: t("general") },
    { id: "video", label: t("video") },
    { id: "ai", label: t("ai-settings") },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {defaultData ? t("edit-lesson") : t("add-lesson")}
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.tabsNav}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.body}>
          {activeTab === "general" && (
            <GeneralTab data={lessonData} onChange={handleChange} />
          )}
          {activeTab === "video" && (
            <VideoTab data={lessonData} onChange={handleChange} />
          )}
          {activeTab === "ai" && (
            <AITab data={lessonData} onChange={handleChange} />
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("cancel")}
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => onSave(lessonData)}
          >
            <IoSaveOutline /> {t("save-lesson")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LessonModal;
