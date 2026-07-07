import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoTrophyOutline } from "react-icons/io5";
import VideoPlayer from "./VideoPlayer";
import CurriculumSidebar from "./CurriculumSidebar";
import LessonTabs from "./LessonTabs";
import styles from "./CoursePlayer.module.css";

const MOCK_COURSE = {
  title: "Advanced Front-End Architecture",
  department: "Web Development",
  progress: 35, // نسبة الإنجاز
  sections: [
    {
      id: 1,
      title: "Chapter 1 - Introduction",
      isCompleted: true,
      lessons: [
        {
          id: 101,
          title: "Welcome to the course",
          duration: "05:00",
          status: "completed",
        },
        {
          id: 102,
          title: "Setting up the environment",
          duration: "12:30",
          status: "completed",
        },
      ],
    },
    {
      id: 2,
      title: "Chapter 2 - Core Concepts",
      isCompleted: false,
      lessons: [
        {
          id: 201,
          title: "Understanding the DOM",
          duration: "15:20",
          status: "playing",
        },
        {
          id: 202,
          title: "State Management Basics",
          duration: "20:00",
          status: "locked",
        },
      ],
    },
    {
      id: 3,
      title: "Chapter 3 - Advanced Topics",
      isCompleted: false,
      lessons: [
        {
          id: 301,
          title: "Welcome to the course",
          duration: "05:00",
          status: "completed",
        },
        {
          id: 302,
          title: "Advanced CSS Techniques",
          duration: "18:45",
          status: "locked",
        },
      ],
    },
    {
      id: 4,
      title: "Chapter 4 - Performance Optimization",
      isCompleted: false,
      quiz: {
        id: 555,
        title: "Section 1 Final Assessment",
      },
      lessons: [
        {
          id: 401,
          title: "Understanding the DOM",
          duration: "15:20",
          status: "playing",
        },
        {
          id: 402,
          title: "State Management Basics",
          duration: "20:00",
          status: "locked",
        },
      ],
    },
  ],
  currentLesson: {
    id: 401,
    title: "Understanding the DOM",
    description:
      "In this lesson, we will dive deep into how the Document Object Model works behind the scenes. We cover rendering strategies, reconciliation, and common performance pitfalls.",
    attachments: [
      { id: 1, name: "DOM_CheatSheet.pdf", size: "2.4 MB" },
      { id: 2, name: "Starter_Template.zip", size: "15 MB" },
    ],
  },
};

const CoursePlayerContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.pageWrapper}>
      {/* الشريط العلوي الفخم */}
      <div className={styles.topNav}>
        <div className={styles.navLeft}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <IoChevronBack /> Back
          </button>
          <div className={styles.divider}></div>
          <h1 className={styles.courseHeaderTitle}>{MOCK_COURSE.title}</h1>
        </div>
        <div className={styles.navRight}>
          <div className={styles.progressContainer}>
            <IoTrophyOutline className={styles.trophyIcon} />
            <div className={styles.progressText}>
              <span>Your Progress</span>
              <strong>{MOCK_COURSE.progress}%</strong>
            </div>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressFill}
                style={{ width: `${MOCK_COURSE.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* تخطيط المشغل (اليسار للفيديو، اليمين للمنهج) */}
      <div className={styles.playerGrid}>
        <div className={styles.mainColumn}>
          <VideoPlayer lessonTitle={MOCK_COURSE.currentLesson.title} />
          <LessonTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            lessonDetails={MOCK_COURSE.currentLesson}
          />
        </div>

        <div className={styles.sidebarColumn}>
          <CurriculumSidebar sections={MOCK_COURSE.sections} />
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerContent;
