import { useState } from "react";
import {
  IoRibbonOutline,
  IoSearchOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import CertificateCard from "./CertificateCard";
import styles from "./Certificates.module.css";
import { useTranslation } from "react-i18next";

const MOCK_CERTIFICATES = [
  {
    id: "cert-1",
    courseName: "Advanced React & Next.js Architecture",
    studentName: "Firstname Fathername Lastname",
    issueDate: "July 7, 2026",
    credentialId: "LNC-2026-8891A",
    instructor: "Eng. Ahmed Nabil",
    logo: "/images/linco-logo.jpg",
  },
  {
    id: "cert-2",
    courseName: "Flutter Cross-Platform Development",
    studentName: "Abrar Mohammed Abo Auad",
    issueDate: "May 14, 2026",
    credentialId: "LNC-2026-3324F",
    instructor: "Dr. Sara Majed",
    logo: "/images/linco-logo.jpg",
  },
  {
    id: "cert-2",
    courseName: "Flutter Cross-Platform Development",
    studentName: "Abrar Mohammed Abo Auad",
    issueDate: "May 14, 2026",
    credentialId: "LNC-2026-3324F",
    instructor: "Dr. Sara Majed",
    logo: "/images/linco-logo.jpg",
  },
];

const CertificatesContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCerts = MOCK_CERTIFICATES.filter((cert) =>
    cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoRibbonOutline className={styles.headerIcon} />
            </div>
            <div>
              <span className={styles.subHeading}>{t("achievements")}</span>
              <h1 className={styles.title}>{t("my-certificates")}</h1>
              <p className={styles.description}>
                {t(
                  "view-download-and-share-your-earned-certificates-from-completed-courses",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.searchBox}>
            <IoSearchOutline className={styles.searchIcon} />
            <input
              type="text"
              placeholder={t("search-certificates-by-course-name")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.gridSection}>
          {filteredCerts.length === 0 ? (
            <div className={styles.emptyState}>
              <IoSchoolOutline className={styles.emptyIcon} />
              <h3>{t("no-certificates-found")}</h3>
              <p>
                {t(
                  "complete-courses-to-earn-your-certificates-and-showcase-your-skills",
                )}
              </p>
            </div>
          ) : (
            <div className={styles.certsGrid}>
              {filteredCerts.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificatesContent;
