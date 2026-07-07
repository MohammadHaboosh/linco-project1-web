import { IoDocumentTextOutline, IoDownloadOutline } from "react-icons/io5";
import styles from "./CoursePlayer.module.css";

const LessonTabs = ({ activeTab, setActiveTab, lessonDetails }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "qa", label: "Q&A" },
    { id: "notes", label: "My Notes" },
  ];

  return (
    <div className={styles.contentContainer}>
      {/* التبويبات بخط سفلي (Modern Underline) */}
      <div className={styles.tabsHeader}>
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

      {/* المحتوى */}
      <div className={styles.tabBody}>
        {activeTab === "overview" && (
          <div className={styles.overviewSection}>
            <h3 className={styles.sectionTitle}>About this lesson</h3>
            <p className={styles.descriptionText}>
              {lessonDetails.description}
            </p>

            {lessonDetails.attachments?.length > 0 && (
              <div className={styles.attachmentsWrapper}>
                <h4 className={styles.attachTitle}>Lesson Resources</h4>
                <div className={styles.attachmentsGrid}>
                  {lessonDetails.attachments.map((file) => (
                    <div key={file.id} className={styles.attachmentCard}>
                      <div className={styles.attachIcon}>
                        <IoDocumentTextOutline />
                      </div>
                      <div className={styles.attachInfo}>
                        <span className={styles.fileName}>{file.name}</span>
                        <span className={styles.fileSize}>{file.size}</span>
                      </div>
                      <button className={styles.downloadIcon}>
                        <IoDownloadOutline />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "qa" && (
          <div className={styles.emptyState}>
            No questions yet. Be the first to ask!
          </div>
        )}
        {activeTab === "notes" && (
          <div className={styles.emptyState}>
            Start typing your private notes here...
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
