import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoPersonCircleOutline,
  IoChatbubbleEllipsesOutline,
  IoHelpCircleOutline,
  IoChevronDownOutline,
  IoPlayCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";

const faqs = [
  {
    q: "هل أحتاج لخبرة سابقة في JavaScript؟",
    a: "يفضل أن يكون لديك أساس جيد في JavaScript و ES6+ قبل البدء بهذا الجزء من الكورس.",
  },
  {
    q: "متى أستخدم useEffect؟",
    a: "استخدمه للتعامل مع الآثار الجانبية مثل الاشتراكات، جلب البيانات، والتكامل مع أنظمة خارجية.",
  },
  {
    q: "هل يمكنني استخدام Context بدلاً من Redux؟",
    a: "نعم في كثير من الحالات، والاختيار يعتمد على حجم الحالة وتعقيدها وطريقة مشاركتها داخل التطبيق.",
  },
];

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(0);
  const [question, setQuestion] = useState("");

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "attachments", label: "الملحقات", count: 3 },
    { id: "qa", label: "Q&A", count: 12 },
    { id: "faq", label: "FAQ", count: 3 },
  ];

  return (
    <section className={styles.tabsContainer}>
      <nav className={styles.tabsHeader} aria-label="Lesson tabs">
        <div className={styles.tabsScroll}>
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count && <span>{tab.count}</span>}
            </button>
          ))}
        </div>
        <button type="button" className={styles.notesBtn}>
          <IoDocumentTextOutline />
          ملاحظاتي
        </button>
      </nav>

      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <div className={styles.overview}>
            <div className={styles.overviewMain}>
              <span className={styles.kicker}>ABOUT THIS LESSON</span>
              <h3>Component Lifecycle & Hooks</h3>
              <p>
                في هذا الدرس ستتعرف على دورة حياة المكونات الوظيفية وكيفية
                استخدام React Hooks لإدارة الحالة والآثار الجانبية وبناء مكونات
                قابلة للتوسع.
              </p>
              <div className={styles.learningGrid}>
                <div>
                  <strong>01</strong>
                  <span>فهم دورة حياة المكون</span>
                </div>
                <div>
                  <strong>02</strong>
                  <span>إدارة الآثار الجانبية</span>
                </div>
                <div>
                  <strong>03</strong>
                  <span>كتابة Custom Hooks</span>
                </div>
              </div>
            </div>
            <aside className={styles.lessonFacts}>
              <div>
                <span>المدة</span>
                <strong>12:40</strong>
              </div>
              <div>
                <span>المستوى</span>
                <strong>متوسط</strong>
              </div>
              <div>
                <span>الملحقات</span>
                <strong>3 ملفات</strong>
              </div>
            </aside>
          </div>
        )}

        {activeTab === "attachments" && (
          <div className={styles.attachments}>
            <div className={styles.contentHeader}>
              <div>
                <span className={styles.kicker}>RESOURCES</span>
                <h3>ملحقات الدرس</h3>
              </div>
              <button type="button">
                <IoDownloadOutline /> تحميل الكل
              </button>
            </div>

            <div className={styles.fileGrid}>
              {[
                ["React_Hooks_CheatSheet.pdf", "2.4 MB", "PDF"],
                ["lesson-notes.md", "18 KB", "MD"],
                ["hooks-examples.zip", "6.8 MB", "ZIP"],
              ].map(([name, size, type]) => (
                <div className={styles.fileCard} key={name}>
                  <div className={styles.fileType}>{type}</div>
                  <div className={styles.fileInfo}>
                    <strong>{name}</strong>
                    <span>{size} • متاح للتحميل</span>
                  </div>
                  <button type="button" aria-label={`تحميل ${name}`}>
                    <IoDownloadOutline />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "qa" && (
          <div className={styles.qaSection}>
            <div className={styles.contentHeader}>
              <div>
                <span className={styles.kicker}>COMMUNITY</span>
                <h3>أسئلة ونقاشات الدرس</h3>
              </div>
              <span className={styles.questionCount}>12 سؤالاً</span>
            </div>

            <div className={styles.askBox}>
              <IoPersonCircleOutline />
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="اطرح سؤالاً حول هذا الدرس..."
              />
              <button type="button" disabled={!question.trim()}>
                نشر السؤال
              </button>
            </div>

            <div className={styles.thread}>
              <article className={styles.questionCard}>
                <IoPersonCircleOutline className={styles.avatar} />
                <div>
                  <div className={styles.qMeta}>
                    <strong>أحمد محمد</strong>
                    <span>منذ يومين</span>
                  </div>
                  <p>
                    هل يمكنني استخدام Context API بدلاً من Redux في المشاريع
                    الكبيرة؟
                  </p>
                  <button type="button">إضافة رد</button>
                </div>
              </article>

              <article className={styles.replyCard}>
                <IoPersonCircleOutline className={styles.avatarTeacher} />
                <div>
                  <div className={styles.qMeta}>
                    <strong>المدرب</strong>
                    <span className={styles.teacherBadge}>مدرس</span>
                    <span>منذ يوم</span>
                  </div>
                  <p>
                    نعم، يعتمد ذلك على تعقيد الحالة. Context مناسب للحالات
                    البسيطة والمتوسطة، بينما Redux يوفر أدوات أوسع للتتبع وإدارة
                    الحالات المعقدة.
                  </p>
                </div>
              </article>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className={styles.faqSection}>
            <div className={styles.faqTop}>
              <div>
                <span className={styles.kicker}>HELP CENTER</span>
                <h3>الأسئلة الشائعة</h3>
              </div>
              <label className={styles.faqSearch}>
                <IoSearchOutline />
                <input placeholder="ابحث في الأسئلة..." />
              </label>
            </div>

            <div className={styles.faqList}>
              {faqs.map((item, index) => {
                const open = openFaq === index;
                return (
                  <button
                    type="button"
                    className={`${styles.faqItem} ${open ? styles.faqOpen : ""}`}
                    key={item.q}
                    onClick={() => setOpenFaq(open ? -1 : index)}
                  >
                    <span className={styles.faqIcon}>
                      <IoHelpCircleOutline />
                    </span>
                    <span className={styles.faqText}>
                      <strong>{item.q}</strong>
                      {open && <span>{item.a}</span>}
                    </span>
                    <IoChevronDownOutline
                      className={open ? styles.faqChevronOpen : ""}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LessonTabs;
