import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoTrashOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import LessonList from "../LessonList/LessonList";
import QuestionBankSection from "../QuestionBankSection/QuestionBankSection";
import SectionQuizSection from "../SectionQuizSection/SectionQuizSection";
import styles from "../CurriculumTab.module.css";
import { useTranslation } from "react-i18next";

const SectionCard = ({ section, index, isExpanded, logic, readOnly = false }) => {
  const { t, i18n } = useTranslation();
  const formattedSectionNumber = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
  ).format(index + 1);

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={(e) => {
              e.stopPropagation();
              logic.toggleSection(section.id);
            }}
            aria-expanded={isExpanded}
            aria-label={
              isExpanded
                ? t("collapse-section", { number: formattedSectionNumber })
                : t("expand-section", { number: formattedSectionNumber })
            }
          >
            {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
          </button>
          <div className={styles.sectionBadge}>
            <IoFolderOpenOutline aria-hidden="true" />
            <span>
              {t("section-number", { number: formattedSectionNumber })}
            </span>
          </div>
          {readOnly ? (
            <h4 className={styles.sectionTitleReadOnly}>{section.title}</h4>
          ) : (
            <input
              type="text"
              className={styles.sectionTitleInput}
              value={section.title || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) =>
                logic.updateSectionTitle(section.id, e.target.value)
              }
              aria-label={t("section-title-label", {
                number: formattedSectionNumber,
              })}
            />
          )}
        </div>
        {!readOnly && (
          <div className={styles.sectionHeaderRight}>
            <button
              type="button"
              className={styles.deleteSectionBtn}
              onClick={(e) => logic.deleteSection(e, section.id)}
              aria-label={t("delete-section-label", {
                number: formattedSectionNumber,
              })}
            >
              <IoTrashOutline aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className={styles.sectionBody}>
          <LessonList
            lessons={section.lessons || []}
            onAddLesson={() => logic.openModal("lesson", section.id)}
            onDeleteLesson={(lessonId) =>
              logic.deleteLesson(section.id, lessonId)
            }
            onReorderLessons={(reordered) =>
              logic.handleReorderLessons(section.id, reordered)
            }
            onAddAttachment={(lessonId, attData) =>
              logic.handleAddAttachment(section.id, lessonId, attData)
            }
            onDeleteAttachment={(lessonId, attId) =>
              logic.handleDeleteAttachment(section.id, lessonId, attId)
            }
            onFetchAttachments={logic.handleFetchAttachments}
            isLoading={section.isLessonsLoading}
            hasError={section.lessonsLoadError}
            onRetry={() => logic.handleFetchLessonsForSection(section.id)}
            readOnly={readOnly}
          />
          <div className={styles.bottomAssessmentRow}>
            <QuestionBankSection
              questions={section.questions || []}
              onAddQuestion={() => logic.openModal("question", section.id)}
              onDeleteQuestion={(qId) => logic.deleteQuestion(section.id, qId)}
              isLoading={section.isQuestionsLoading}
              hasError={section.questionsLoadError}
              onRetry={() => logic.handleFetchQuestionsForSection(section.id)}
              readOnly={readOnly}
            />
            <SectionQuizSection
              quiz={section.quiz}
              onAddQuiz={() => logic.openModal("quiz", section.id)}
              onDeleteQuiz={() => logic.deleteQuiz(section.id)}
              isLoading={section.isQuizLoading}
              hasError={section.quizLoadError}
              onRetry={() => logic.handleFetchQuizForSection(section.id)}
              readOnly={readOnly}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SectionCard;
