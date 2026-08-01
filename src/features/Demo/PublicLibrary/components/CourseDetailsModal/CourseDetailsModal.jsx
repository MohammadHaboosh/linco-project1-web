import { useState } from "react";
import {
  IoCloseOutline,
  IoGlobeOutline,
  IoTimeOutline,
  IoBookOutline,
  IoLayersOutline,
  IoCheckmarkCircleOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import styles from "./CourseDetailsModal.module.css";

const CourseDetailsModal = ({ course, onClose, onEnroll }) => {
  const [activeTab, setActiveTab] = useState("overview"); // overview | curriculum | faqs

  if (!course) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <img
              src={course.imagePath}
              alt={course.title}
              className={styles.headerThumb}
            />
            <div>
              <span className={styles.publisherBadge}>
                <IoGlobeOutline /> {course.demo?.name}
              </span>
              <h2>{course.title}</h2>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "curriculum" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("curriculum")}
          >
            Curriculum ({course.sectionsCount} Sections)
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "faqs" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("faqs")}
          >
            FAQs
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {activeTab === "overview" && (
            <div className={styles.overviewSection}>
              <h3>About this course</h3>
              <p className={styles.description}>{course.description}</p>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <IoBookOutline size={20} />
                  <span>{course.lessonCount} Lessons</span>
                </div>
                <div className={styles.statBox}>
                  <IoTimeOutline size={20} />
                  <span>{course.totalDuration} Minutes</span>
                </div>
                <div className={styles.statBox}>
                  <IoLayersOutline size={20} />
                  <span>{course.sectionsCount} Sections</span>
                </div>
              </div>

              <h3>Tags</h3>
              <div className={styles.tagsFlex}>
                {course.tags?.map((tag) => (
                  <span key={tag.id} className={styles.tagBadge}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className={styles.curriculumSection}>
              <div className={styles.lockNotice}>
                <p>
                  🔒 You must enroll in this course to access the internal
                  lesson contents and videos[cite: 1].
                </p>
              </div>
              {/* عرض الأقسام والدروس بشكل عام دون السماح بالدخول المباشر */}
              <div className={styles.sectionItem}>
                <div className={styles.sectionHeader}>
                  <IoLayersOutline /> Course Content Structure (
                  {course.sectionsCount} Sections, {course.lessonCount} Lessons)
                </div>
                <ul className={styles.lessonsList}>
                  <li>
                    <span>Lesson 1: Introduction & Basics</span>{" "}
                    <span className={styles.lockTag}>Locked</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className={styles.faqsSection}>
              <h3>Frequently Asked Questions</h3>
              <div className={styles.faqItem}>
                <h4>
                  <IoHelpCircleOutline /> How do I access the lessons?
                </h4>
                <p>
                  Once you click Enroll (for free courses) or purchase, full
                  access to sections and lessons will be granted instantly[cite:
                  1].
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.modalFooter}>
          <div className={styles.priceTag}>
            {course.price === 0 ? (
              <span className={styles.freeText}>Free Course</span>
            ) : (
              <span className={styles.priceText}>${course.price}</span>
            )}
          </div>
          <button className={styles.enrollBtn} onClick={() => onEnroll(course)}>
            {course.price === 0
              ? "Enroll for Free"
              : `Buy Course ($${course.price})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsModal;
