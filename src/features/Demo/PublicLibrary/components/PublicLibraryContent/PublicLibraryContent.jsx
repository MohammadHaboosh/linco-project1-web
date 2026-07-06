import { useState, useRef, useEffect } from "react";
import {
  IoGlobeOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import MarketplaceCard from "../MarketplaceCard/MarketplaceCard";
import styles from "./PublicLibraryContent.module.css";
import { useTranslation } from "react-i18next";

const MARKETPLACE_COURSES = [
  {
    id: 101,
    title: "Advanced React & Next.js",
    company: "Google Workspace",
    description: "Master complex UI building and SSR architecture.",
    price: 49.99,
    isMyDemo: false,
    isPrivate: false,
    rating: 4.9,
    students: 1240,
    tags: ["React", "Architecture", "Web"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 102,
    title: "Company Onboarding 2026",
    company: "LinCo.TechCorp",
    description: "Internal onboarding procedures and HR guidelines.",
    price: 0,
    isMyDemo: true,
    isPrivate: true,
    rating: 4.5,
    students: 85,
    tags: ["HR", "Onboarding", "Internal"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 103,
    title: "Figma UI/UX Masterclass",
    company: "Design Academy",
    description: "Create professional design systems from scratch.",
    price: 0,
    isMyDemo: false,
    isPrivate: false,
    rating: 4.8,
    students: 3450,
    tags: ["Figma", "UI/UX", "Design"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 104,
    title: "Node.js Microservices",
    company: "LinCo.TechCorp",
    description: "Learn to build scalable backend systems using Node & Docker.",
    price: 89.99,
    isMyDemo: true,
    isPrivate: false,
    rating: 5.0,
    students: 432,
    tags: ["Node.js", "Backend", "Docker"],
    image: "/images/linco-logo.jpg",
  },
  {
    id: 105,
    title: "Python for Data Science",
    company: "DataCamp",
    description: "Comprehensive guide to Data Analysis and Machine Learning.",
    price: 29.99,
    isMyDemo: false,
    isPrivate: false,
    rating: 4.7,
    students: 890,
    tags: ["Python", "Data", "AI"],
    image: "/images/linco-logo.jpg",
  },
];

const PublicLibraryContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(t("all-categories"));
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    "All Categories",
    "Front-End",
    "Back-End",
    "UI/UX",
    "Management",
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerArea}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoGlobeOutline className={styles.headerIcon} />
          </div>
          <div>
            <span className={styles.subHeading}>{t("global-marketplace")}</span>
            <h1 className={styles.title}>{t("ublic-course-library")}</h1>
            <p className={styles.description}>
              {t("explore-premium-courses-or-publish-your-own-assets")}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controlsWrapper}>
        <div className={styles.controlsInner}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-courses")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.divider}></div>

          <div className={styles.filterBox} ref={filterRef}>
            <button
              className={styles.filterBtn}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IoFilterOutline className={styles.filterIcon} /> {activeCategory}{" "}
              <IoChevronDownOutline />
            </button>
            {isFilterOpen && (
              <div className={styles.filterDropdown}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.catItem} ${activeCategory === cat ? styles.catActive : ""}`}
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsFilterOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.coursesGrid}>
        {MARKETPLACE_COURSES.map((course) => (
          <MarketplaceCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default PublicLibraryContent;
