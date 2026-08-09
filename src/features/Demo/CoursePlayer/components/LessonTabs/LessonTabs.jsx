import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoPersonCircleOutline,
  IoSearchOutline,
  IoHelpCircleOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

const faqs = [
  {
    q: "هل أحتاج لخبرة سابقة في JavaScript؟",
    a: "يفضل أن يكون لديك أساس جيد قبل البدء بهذا الجزء.",
  },
  {
    q: "متى أستخدم useEffect؟",
    a: "استخدمه للتعامل مع الآثار الجانبية مثل جلب البيانات.",
  },
];

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(0);

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "attachments", label: "الملحقات", count: 3 },
    { id: "qa", label: "الأسئلة والأجوبة", count: 12 },
    { id: "faq", label: "الأسئلة الشائعة", count: 2 },
  ];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count && <span className={styles.badge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <div className={styles.overviewPanel}>
            <h3>عن هذا الدرس</h3>
            <p>
              ستتعرف على دورة حياة المكونات الوظيفية وكيفية استخدام React Hooks
              لبناء مكونات قابلة للتوسع.
            </p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span>المدة:</span> <strong>12:40 دقيقة</strong>
              </div>
              <div className={styles.statCard}>
                <span>المستوى:</span> <strong>متوسط</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === "attachments" && (
          <div className={styles.attachmentsPanel}>
            <div className={styles.filesGrid}>
              {[
                "React_Hooks_CheatSheet.pdf",
                "lesson-notes.md",
                "hooks-examples.zip",
              ].map((file, i) => (
                <div className={styles.fileCard} key={i}>
                  <IoDocumentTextOutline className={styles.fileIcon} />
                  <span>{file}</span>
                  <button className={styles.downloadBtn}>
                    <IoDownloadOutline />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className={styles.qaPanel}>
            <div className={styles.askBox}>
              <IoPersonCircleOutline className={styles.avatar} />
              <input type="text" placeholder="اطرح سؤالاً حول هذا الدرس..." />
              <button>نشر</button>
            </div>
            <div className={styles.qaCard}>
              <div className={styles.qaHeader}>
                <strong>أحمد محمد</strong> <span>منذ يومين</span>
              </div>
              <p>
                هل يمكنني استخدام Context API بدلاً من Redux في المشاريع
                الكبيرة؟
              </p>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className={styles.faqPanel}>
            {faqs.map((faq, index) => (
              <div
                className={`${styles.faqItem} ${openFaq === index ? styles.faqOpen : ""}`}
                key={index}
              >
                <div
                  className={styles.faqHeader}
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                >
                  <div className={styles.faqTitle}>
                    <IoHelpCircleOutline /> {faq.q}
                  </div>
                  <IoChevronDownOutline className={styles.chevron} />
                </div>
                {openFaq === index && (
                  <div className={styles.faqBody}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
