import { useState } from "react";
import {
  IoReorderTwoOutline,
  IoPlayCircleOutline,
  IoTrashOutline,
  IoAddOutline,
  IoTimeOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoAttachOutline,
  IoDocumentAttachOutline,
} from "react-icons/io5";
import styles from "../CurriculumTab.module.css";
import AddAttachmentModal from "../AddModals/AddAttachmentModal";
import { useTranslation } from "react-i18next";

const formatVideoDuration = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds)) return "00:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const LessonList = ({
  lessons = [],
  onAddLesson,
  onDeleteLesson,
  onReorderLessons,
  onAddAttachment,
  onDeleteAttachment,
  onFetchAttachments,
  isLoading,
  hasError,
  onRetry,
  readOnly = false,
}) => {
  const { t, i18n } = useTranslation();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState([]);
  const [attachmentStates, setAttachmentStates] = useState({});
  const [activeLessonForAttachment, setActiveLessonForAttachment] =
    useState(null);

  const loadAttachments = async (lessonId) => {
    if (!onFetchAttachments) return;
    setAttachmentStates((current) => ({
      ...current,
      [lessonId]: { loading: true, error: false, loaded: false },
    }));
    try {
      await onFetchAttachments(lessonId);
      setAttachmentStates((current) => ({
        ...current,
        [lessonId]: { loading: false, error: false, loaded: true },
      }));
    } catch {
      setAttachmentStates((current) => ({
        ...current,
        [lessonId]: { loading: false, error: true, loaded: false },
      }));
    }
  };

  const toggleLessonExpand = async (lessonId, e) => {
    if (e) e.stopPropagation();
    if (expandedLessons.includes(lessonId)) {
      setExpandedLessons(expandedLessons.filter((id) => id !== lessonId));
    } else {
      setExpandedLessons([...expandedLessons, lessonId]);
      if (onFetchAttachments && !attachmentStates[lessonId]?.loaded) {
        await loadAttachments(lessonId);
      }
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updatedLessons = [...lessons];
    const [draggedItem] = updatedLessons.splice(draggedIndex, 1);
    updatedLessons.splice(targetIndex, 0, draggedItem);

    onReorderLessons(updatedLessons);
    setDraggedIndex(null);
  };

  return (
    <div className={styles.lessonsContainer}>
      <div className={styles.lessonsHeader}>
        <h4 className={styles.subSectionTitle}>{t("lessons-list")}</h4>
        {!readOnly && (
          <button
            type="button"
            className={styles.addLessonBtn}
            onClick={onAddLesson}
            disabled={isLoading || hasError}
          >
            <IoAddOutline aria-hidden="true" /> {t("add-lesson")}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.emptyState} role="status">
          {t("loading-lessons")}
        </div>
      ) : hasError ? (
        <div className={styles.drawerError} role="alert">
          <span>{t("course-lessons-load-failed")}</span>
          <button type="button" onClick={onRetry}>
            {t("retry")}
          </button>
        </div>
      ) : lessons.length === 0 ? (
        <div className={styles.emptyState} role="status">
          {t("no-lessons-added-yet")}
        </div>
      ) : (
        <div className={styles.lessonsList}>
          {lessons.map((lesson, index) => {
            const isExpanded = expandedLessons.includes(lesson.id);
            const attachmentsCount = lesson.attachments?.length || 0;
            const formattedAttachmentsCount = new Intl.NumberFormat(
              i18n.resolvedLanguage || i18n.language,
            ).format(attachmentsCount);
            const formattedDuration = formatVideoDuration(lesson.duration || 0);
            const attachmentState = attachmentStates[lesson.id];

            return (
              <div
                key={lesson.id}
                className={styles.lessonWrapperCard}
                draggable={!readOnly}
                onDragStart={
                  readOnly ? undefined : (e) => handleDragStart(e, index)
                }
                onDragOver={readOnly ? undefined : handleDragOver}
                onDrop={readOnly ? undefined : (e) => handleDrop(e, index)}
                style={{
                  opacity: !readOnly && draggedIndex === index ? 0.4 : 1,
                }}
              >
                <div className={styles.lessonCardHeader}>
                  <div className={styles.lessonLeft}>
                    {!readOnly && (
                      <IoReorderTwoOutline
                        className={styles.dragIcon}
                        title={t("drag-lesson-to-reorder")}
                      />
                    )}

                    <button
                      type="button"
                      className={styles.lessonExpandBtn}
                      onClick={(e) => toggleLessonExpand(lesson.id, e)}
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded
                          ? t("hide-lesson-attachments", {
                              title: lesson.title,
                            })
                          : t("show-lesson-attachments", {
                              title: lesson.title,
                            })
                      }
                    >
                      {isExpanded ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </button>

                    <IoPlayCircleOutline
                      className={styles.lessonIcon}
                      aria-hidden="true"
                    />
                    <div className={styles.lessonMeta}>
                      <span className={styles.lessonTitle}>
                        {t("lesson-list-item-title", {
                          number: new Intl.NumberFormat(
                            i18n.resolvedLanguage || i18n.language,
                          ).format(index + 1),
                          title: lesson.title,
                        })}
                      </span>
                      {lesson.duration > 0 && (
                        <span className={styles.lessonDuration}>
                          <IoTimeOutline aria-hidden="true" />
                          <span
                            style={{
                              fontWeight: "600",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {formattedDuration}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.lessonRight}>
                    <button
                      type="button"
                      className={styles.attachmentBadgeCount}
                      onClick={(e) => toggleLessonExpand(lesson.id, e)}
                      aria-expanded={isExpanded}
                    >
                      <IoAttachOutline aria-hidden="true" />
                      {t("attachment-count", {
                        count: attachmentsCount,
                        formattedCount: formattedAttachmentsCount,
                      })}
                    </button>

                    {!readOnly && (
                      <button
                        type="button"
                        className={styles.deleteLessonBtn}
                        onClick={() => onDeleteLesson(lesson.id)}
                        aria-label={t("delete-lesson-label", {
                          title: lesson.title,
                        })}
                      >
                        <IoTrashOutline />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.attachmentsDrawer}>
                    <div className={styles.drawerHeader}>
                      <h5>
                        <IoAttachOutline aria-hidden="true" />
                        {t("lesson-resources-and-attachments")}
                      </h5>
                    </div>

                    {attachmentState?.loading && (
                      <p className={styles.drawerStatus} role="status">
                        {t("loading-attachments")}
                      </p>
                    )}
                    {attachmentState?.error && (
                      <div className={styles.drawerError} role="alert">
                        <span>{t("attachments-load-failed")}</span>
                        <button
                          type="button"
                          onClick={() => loadAttachments(lesson.id)}
                        >
                          {t("retry")}
                        </button>
                      </div>
                    )}

                    <div className={styles.attachmentsGrid}>
                      {!attachmentState?.loading &&
                        !attachmentState?.error &&
                        !lesson.attachments?.length && (
                          <p className={styles.noAttachments}>
                            {t("no-attachments-available-for-this-lesson")}
                          </p>
                        )}
                      {lesson.attachments?.map((attachment) => {
                        const title =
                          attachment.title || attachment.name || t("resource");
                        const fileName =
                          attachment.fileName || attachment.name || "";

                        return (
                          <div
                            key={attachment.id}
                            className={styles.attachmentItemCard}
                          >
                            <div className={styles.attachmentInfo}>
                              <IoDocumentAttachOutline
                                className={styles.fileIcon}
                              />
                              <div>
                                <p className={styles.fileName}>{title}</p>
                                <span className={styles.fileMeta}>
                                  {attachment.fileSize
                                    ? t("attachment-file-meta", {
                                        fileName,
                                        fileSize: attachment.fileSize,
                                      })
                                    : fileName}
                                </span>
                              </div>
                            </div>
                            {!readOnly && (
                              <button
                                type="button"
                                className={styles.deleteAttachmentBtn}
                                onClick={() =>
                                  onDeleteAttachment &&
                                  onDeleteAttachment(lesson.id, attachment.id)
                                }
                                aria-label={t("remove-attachment-label", {
                                  title,
                                })}
                              >
                                <IoTrashOutline />
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {!readOnly && (
                        <button
                          type="button"
                          className={styles.addAttachmentYellowCard}
                          onClick={() =>
                            setActiveLessonForAttachment(lesson.id)
                          }
                        >
                          <IoAddOutline className={styles.yellowAddIcon} />
                          <span>{t("add-attachment")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!readOnly && (
        <AddAttachmentModal
          isOpen={Boolean(activeLessonForAttachment)}
          onClose={() => setActiveLessonForAttachment(null)}
          onSubmit={(attachmentData) => {
            if (onAddAttachment && activeLessonForAttachment) {
              onAddAttachment(activeLessonForAttachment, attachmentData);
            }
            setActiveLessonForAttachment(null);
          }}
        />
      )}
    </div>
  );
};

export default LessonList;
