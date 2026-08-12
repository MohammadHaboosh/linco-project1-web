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

const SectionCard = ({ section, index, isExpanded, logic }) => {
  return (
    <div className={styles.sectionCard}>
      <div
        className={styles.sectionHeader}
        onClick={() => logic.toggleSection(section.id)}
      >
        <div className={styles.sectionHeaderLeft}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={(e) => {
              e.stopPropagation();
              logic.toggleSection(section.id);
            }}
          >
            {isExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
          </button>
          <div className={styles.sectionBadge}>
            <IoFolderOpenOutline />
            <span>Section {index + 1}</span>
          </div>
          <input
            type="text"
            className={styles.sectionTitleInput}
            value={section.title || ""}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              logic.updateSectionTitle(section.id, e.target.value)
            }
          />
        </div>
        <div className={styles.sectionHeaderRight}>
          <button
            type="button"
            className={styles.deleteSectionBtn}
            onClick={(e) => logic.deleteSection(e, section.id)}
          >
            <IoTrashOutline />
          </button>
        </div>
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
          />
          <div className={styles.bottomAssessmentRow}>
            <QuestionBankSection
              questions={section.questions || []}
              onAddQuestion={() => logic.openModal("question", section.id)}
              onDeleteQuestion={(qId) => logic.deleteQuestion(section.id, qId)}
            />
            <SectionQuizSection
              quiz={section.quiz}
              onAddQuiz={() => logic.openModal("quiz", section.id)}
              onDeleteQuiz={() => logic.deleteQuiz(section.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default SectionCard;
