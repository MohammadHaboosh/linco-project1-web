import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoBarChartOutline,
  IoBookOutline,
  IoBriefcaseOutline,
  IoCheckmarkCircleOutline,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoFlagOutline,
  IoLayersOutline,
  IoMapOutline,
  IoRocketOutline,
  IoTimeOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "./Roadmaps.module.css";

const RoadmapList = ({ icon, title, items, accent = "blue" }) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className={`${styles.detailGroup} ${styles[accent]}`}>
      <div className={styles.detailTitle}>
        <span aria-hidden="true">{icon}</span>
        <h4>{title}</h4>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const GeneratedRoadmap = ({ roadmap }) => {
  const { t, i18n } = useTranslation();
  const roadmapRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const locale = i18n.resolvedLanguage || i18n.language;
  const steps = Array.isArray(roadmap.steps) ? roadmap.steps : [];
  const difficulty = String(roadmap.difficulty ?? "").toLowerCase();
  const difficultyClass = ["beginner", "intermediate", "advanced"].includes(
    difficulty,
  )
    ? styles[difficulty]
    : styles.intermediate;
  const difficultyLabel = ["beginner", "intermediate", "advanced"].includes(
    difficulty,
  )
    ? t(`roadmap-difficulty-${difficulty}`)
    : roadmap.difficulty || t("difficulty-not-specified");
  const formattedStepCount = new Intl.NumberFormat(locale).format(steps.length);
  const formatStepNumber = (value, minimumIntegerDigits = 1) => {
    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? new Intl.NumberFormat(locale, { minimumIntegerDigits }).format(
          numericValue,
        )
      : value;
  };
  const prerequisites = Array.isArray(roadmap.prerequisites)
    ? roadmap.prerequisites
    : [];
  const careerOutcomes = Array.isArray(roadmap.careerOutcomes)
    ? roadmap.careerOutcomes
    : [];

  const handleDownloadPDF = async () => {
    if (!roadmapRef.current) return;
    setIsDownloading(true);

    const element = roadmapRef.current;
    const originalStyle = element.getAttribute("style") || "";
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";

    try {
      if (!isDark) {
        element.style.setProperty("--app-heading", "#0f172a", "important");
        element.style.setProperty("--app-text-strong", "#1e293b", "important");
        element.style.setProperty("--app-text", "#334155", "important");
        element.style.setProperty("--app-muted", "#475569", "important"); // تغميق الرمادي الباهت
        element.style.setProperty("--app-surface", "#ffffff", "important");
        element.style.setProperty("--app-border", "#94a3b8", "important"); // توضيح الحدود
        element.style.setProperty(
          "--app-border-strong",
          "#64748b",
          "important",
        );
        element.style.setProperty("--app-page-bg", "#ffffff", "important");
      }

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: isDark ? "#111827" : "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);

      let heightLeft = pdfHeight - pageHeight;
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      const safeTitle = (roadmap.title || "Roadmap")
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      pdf.save(`${safeTitle}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        t(
          "roadmap-download-failed",
          "Failed to download PDF. Please try again.",
        ),
      );
    } finally {
      // إعادة التنسيقات لطبيعتها بعد التقاط الصورة
      element.setAttribute("style", originalStyle);
      setIsDownloading(false);
    }
  };

  return (
    <section
      className={styles.resultSection}
      aria-live="polite"
      ref={roadmapRef}
    >
      <div className={styles.resultHero} data-html2canvas-ignore="false">
        <div className={styles.resultHeroContent}>
          <span className={styles.generatedLabel}>
            <IoCheckmarkCircleOutline aria-hidden="true" />
            {t("ai-generated-roadmap")}
          </span>
          <h2>{roadmap.title}</h2>
          <p>{roadmap.description}</p>

          <div className={styles.roadmapMeta}>
            <span>
              <IoTimeOutline aria-hidden="true" />
              {roadmap.duration || t("duration-not-specified")}
            </span>
            <span className={difficultyClass}>
              <IoBarChartOutline aria-hidden="true" />
              {difficultyLabel}
            </span>
            <span>
              <IoLayersOutline aria-hidden="true" />
              {t("roadmap-step-count", {
                count: steps.length,
                formattedCount: formattedStepCount,
              })}
            </span>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={styles.downloadPdfButton}
              data-html2canvas-ignore="true"
            >
              <IoDownloadOutline aria-hidden="true" />
              {isDownloading
                ? t("downloading", "Downloading...")
                : t("download-pdf", "Download PDF")}
            </button>
          </div>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <IoRocketOutline />
        </div>
      </div>

      <div className={styles.overviewGrid}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewHeading}>
            <div className={styles.overviewIcon}>
              <IoBookOutline aria-hidden="true" />
            </div>
            <div>
              <span>{t("before-you-start")}</span>
              <h3>{t("prerequisites")}</h3>
            </div>
          </div>
          {prerequisites.length > 0 ? (
            <ul>
              {prerequisites.map((item, index) => (
                <li key={`${item}-${index}`}>
                  <IoCheckmarkCircleOutline aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.overviewEmpty}>
              {t("roadmap-no-prerequisites")}
            </p>
          )}
        </div>

        <div className={styles.overviewCard}>
          <div className={styles.overviewHeading}>
            <div className={`${styles.overviewIcon} ${styles.outcomeIcon}`}>
              <IoBriefcaseOutline aria-hidden="true" />
            </div>
            <div>
              <span>{t("where-this-leads")}</span>
              <h3>{t("career-outcomes")}</h3>
            </div>
          </div>
          {careerOutcomes.length > 0 ? (
            <div className={styles.outcomeTags}>
              {careerOutcomes.map((outcome, index) => (
                <span key={`${outcome}-${index}`}>{outcome}</span>
              ))}
            </div>
          ) : (
            <p className={styles.overviewEmpty}>
              {t("roadmap-no-career-outcomes")}
            </p>
          )}
        </div>
      </div>

      <div className={styles.timelineHeader}>
        <span>{t("step-by-step-plan")}</span>
        <h3>{t("your-learning-journey")}</h3>
        <p>{t("roadmap-timeline-description")}</p>
      </div>

      {steps.length > 0 ? (
        <div className={styles.timeline} role="list">
          {steps.map((step, index) => {
            const stepId = `roadmap-step-${index}`;
            const week = formatStepNumber(step.week ?? index + 1);

            return (
              <article
                className={styles.stepRow}
                key={`${step.week}-${step.topic}-${index}`}
                role="listitem"
                aria-labelledby={stepId}
              >
                <div className={styles.timelineRail}>
                  <div className={styles.weekMarker}>{week}</div>
                  {index < steps.length - 1 && (
                    <div className={styles.railLine} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.stepCard}>
                  <div className={styles.stepHeader}>
                    <div>
                      <span className={styles.weekLabel}>
                        {t("roadmap-week", { week })}
                      </span>
                      <h3 id={stepId}>{step.topic}</h3>
                    </div>
                    <span className={styles.stepNumber} aria-hidden="true">
                      {formatStepNumber(index + 1, 2)}
                    </span>
                  </div>

                  {step.goal && (
                    <div className={styles.goalBox}>
                      <IoFlagOutline aria-hidden="true" />
                      <div>
                        <strong>{t("goal")}</strong>
                        <p>{step.goal}</p>
                      </div>
                    </div>
                  )}

                  <div className={styles.detailsGrid}>
                    <RoadmapList
                      icon={<IoConstructOutline />}
                      title={t("skills")}
                      items={step.skills}
                      accent="blue"
                    />
                    <RoadmapList
                      icon={<IoRocketOutline />}
                      title={t("projects")}
                      items={step.projects}
                      accent="purple"
                    />
                    <RoadmapList
                      icon={<IoCheckmarkCircleOutline />}
                      title={t("deliverables")}
                      items={step.deliverables}
                      accent="green"
                    />
                    <RoadmapList
                      icon={<IoDocumentTextOutline />}
                      title={t("resources")}
                      items={step.resources}
                      accent="orange"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.noStepsState} role="status">
          <IoMapOutline aria-hidden="true" />
          <p>{t("roadmap-no-steps")}</p>
        </div>
      )}
    </section>
  );
};

export default GeneratedRoadmap;
