import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("qa");

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        <button
          className={`${styles.tabBtn} ${activeTab === "attachments" ? styles.active : ""}`}
          onClick={() => setActiveTab("attachments")}
        >
          الملحقات
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "qa" ? styles.active : ""}`}
          onClick={() => setActiveTab("qa")}
        >
          نقاشات الدرس (Q&A)
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "faq" ? styles.active : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          الأسئلة الشائعة (FAQ)
        </button>
      </div>

      <div className={styles.tabContent}>
        {/* الملحقات */}
        {activeTab === "attachments" && (
          <div className={styles.attachmentsGrid}>
            <div className={styles.fileCard}>
              <IoDocumentTextOutline className={styles.fileIcon} />
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>React_CheatSheet.pdf</span>
                <span className={styles.fileSize}>2.4 MB</span>
              </div>
              <button className={styles.downloadBtn}>
                <IoDownloadOutline />
              </button>
            </div>
          </div>
        )}

        {/* الأسئلة والردود */}
        {activeTab === "qa" && (
          <div className={styles.qaSection}>
            <div className={styles.askBox}>
              <IoPersonCircleOutline className={styles.avatarIcon} />
              <input
                type="text"
                placeholder="اطرح سؤالاً حول هذا الدرس..."
                className={styles.askInput}
              />
              <button className={styles.askBtn}>نشر</button>
            </div>

            <div className={styles.questionThread}>
              <div className={styles.mainQuestion}>
                <IoPersonCircleOutline className={styles.avatarIcon} />
                <div className={styles.qContent}>
                  <div className={styles.qMeta}>
                    <strong>أحمد محمد</strong> <span>منذ يومين</span>
                  </div>
                  <p>
                    هل يمكنني استخدام Context API بدلاً من Redux في المشاريع
                    الكبيرة؟
                  </p>
                  <button className={styles.replyBtn}>إضافة رد</button>
                </div>
              </div>

              {/* رد متداخل */}
              <div className={styles.replyThread}>
                <IoPersonCircleOutline
                  className={styles.avatarIcon}
                  style={{ color: "#0056d2" }}
                />
                <div className={styles.qContent}>
                  <div className={styles.qMeta}>
                    <strong>المدرب</strong>{" "}
                    <span className={styles.badge}>مدرس</span>{" "}
                    <span>منذ يوم</span>
                  </div>
                  <p>
                    نعم يا أحمد، ولكن يعتمد ذلك على تعقيد الحالة. Context ممتاز
                    للحالات البسيطة والمتوسطة، لكن Redux يتفوق في تتبع الأخطاء
                    والأداء في التطبيقات الضخمة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs */}
        {activeTab === "faq" && (
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h4>هل أحتاج لخبرة سابقة في JavaScript؟</h4>
              <p>
                نعم، يفضل أن يكون لديك أساس قوي في ES6+ قبل البدء في هذا الكورس.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
