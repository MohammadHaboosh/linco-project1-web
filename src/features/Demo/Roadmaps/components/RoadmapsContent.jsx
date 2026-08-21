import { useState } from "react";
import {
  IoAlertCircleOutline,
  IoArrowForwardOutline,
  IoMapOutline,
  IoRefreshOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import GeneratedRoadmap from "./GeneratedRoadmap";
import styles from "./Roadmaps.module.css";
import { useTranslation } from "react-i18next";
import { useRoadmapGenerator } from "../hooks/useRoadmapGenerator";

const RoadmapsContent = () => {
  const { t, i18n } = useTranslation();
  const [title, setTitle] = useState("");
  const { roadmap, isGenerating, error, generateRoadmap, reset } =
    useRoadmapGenerator();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || isGenerating) return;

    await generateRoadmap(title);
  };

  const handleStartOver = () => {
    reset();
    setTitle("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={styles.pageContainer}
      dir={i18n.dir()}
      aria-busy={isGenerating}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoMapOutline className={styles.headerIcon} aria-hidden="true" />
            </div>
            <div>
              <span className={styles.subHeading}>
                {t("ai-powered-career-planning")}
              </span>
              <h1 className={styles.title}>{t("roadmap-generator")}</h1>
              <p className={styles.description}>
                {t("roadmap-generator-description")}
              </p>
            </div>
          </div>

          {roadmap && (
            <button
              type="button"
              className={styles.startOverButton}
              onClick={handleStartOver}
            >
              <IoRefreshOutline aria-hidden="true" />
              {t("generate-another-roadmap")}
            </button>
          )}
        </div>

        <section
          className={styles.generatorCard}
          aria-labelledby="roadmap-generator-prompt"
        >
          <div className={styles.generatorGlow} aria-hidden="true" />
          <div className={styles.generatorIntro}>
            <div className={styles.sparkleIcon} aria-hidden="true">
              <IoSparklesOutline />
            </div>
            <div>
              <h2 id="roadmap-generator-prompt">
                {t("what-do-you-want-to-learn")}
              </h2>
              <p id="roadmap-title-help">{t("roadmap-title-help")}</p>
            </div>
          </div>

          <form className={styles.generatorForm} onSubmit={handleSubmit}>
            <label htmlFor="roadmap-title" className={styles.srOnly}>
              {t("roadmap-title")}
            </label>
            <div className={styles.promptInputWrapper}>
              <IoMapOutline
                className={styles.promptIcon}
                aria-hidden="true"
              />
              <input
                id="roadmap-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("roadmap-title-placeholder")}
                disabled={isGenerating}
                maxLength={120}
                autoComplete="off"
                aria-describedby="roadmap-title-help"
              />
              <button
                type="submit"
                disabled={!title.trim() || isGenerating}
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className={styles.buttonLoader} aria-hidden="true" />
                    {t("generating-roadmap")}
                  </>
                ) : (
                  <>
                    {t("generate-roadmap")}
                    <IoArrowForwardOutline aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            <div className={styles.promptExamples}>
              <span>{t("try-an-example")}</span>
              {[
                "roadmap-example-backend",
                "roadmap-example-devops",
                "roadmap-example-design",
              ].map((exampleKey) => {
                const example = t(exampleKey);

                return (
                  <button
                    type="button"
                    key={exampleKey}
                    onClick={() => setTitle(example)}
                    disabled={isGenerating}
                  >
                    {example}
                  </button>
                );
              })}
            </div>
          </form>

          {error && (
            <div className={styles.errorBanner} role="alert">
              <IoAlertCircleOutline aria-hidden="true" />
              <div>
                <strong>{t("roadmap-generation-failed")}</strong>
                <p>{t(error, { defaultValue: error })}</p>
              </div>
            </div>
          )}
        </section>

        {isGenerating && (
          <section
            className={styles.generationState}
            role="status"
            aria-live="polite"
          >
            <div className={styles.aiOrb} aria-hidden="true">
              <IoSparklesOutline />
            </div>
            <h2>{t("building-your-roadmap")}</h2>
            <p>{t("building-roadmap-description")}</p>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label={t("roadmap-generation-progress")}
            >
              <span />
            </div>
          </section>
        )}

        {roadmap && !isGenerating && <GeneratedRoadmap roadmap={roadmap} />}
      </div>
    </div>
  );
};

export default RoadmapsContent;
