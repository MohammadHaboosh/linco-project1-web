import { useState } from "react";
import {
  IoRibbonOutline,
  IoSearchOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import CertificateCard from "./CertificateCard";
import CertificateCardSkeleton from "./CertificateCardSkeleton";
import styles from "./Certificates.module.css";
import { useTranslation } from "react-i18next";
import { useCertificates } from "../hooks/useCertificates";

const CertificatesContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { certificates, isLoading, error } = useCertificates();

  const filteredCerts = certificates.filter((cert) =>
    cert.courseName?.toLowerCase().includes(searchQuery.toLowerCase()),
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
              aria-label={t("search-certificates-by-course-name")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.gridSection}>
          {isLoading ? (
            <div className={styles.certsGrid}>
              {Array(6)
                .fill(0)
                .map((_, idx) => (
                  <CertificateCardSkeleton key={`cert-skeleton-${idx}`} />
                ))}
            </div>
          ) : error ? (
            <div className={styles.emptyState} role="alert">
              <IoSchoolOutline className={styles.emptyIcon} />
              <h3>{t("unable-to-load-certificates")}</h3>
              <p className={styles.errorText}>{t("try-again-later")}</p>
            </div>
          ) : filteredCerts.length === 0 ? (
            <div className={styles.emptyState}>
              <IoSchoolOutline className={styles.emptyIcon} />
              <h3>{t("no-certificates-found")}</h3>
              <p>
                {searchQuery
                  ? t("no-results-match-your-search")
                  : t(
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
