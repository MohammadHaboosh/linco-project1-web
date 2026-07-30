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

const LessonList = ({
  lessons = [],
  onAddLesson,
  onDeleteLesson,
  onReorderLessons,
  onAddAttachment,
  onDeleteAttachment,
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [expandedLessons, setExpandedLessons] = useState([]); // لحفظ الدروس المفتوحة
  const [activeLessonForAttachment, setActiveLessonForAttachment] =
    useState(null);

  const toggleLessonExpand = (lessonId, e) => {
    e.stopPropagation();
    if (expandedLessons.includes(lessonId)) {
      setExpandedLessons(expandedLessons.filter((id) => id !== lessonId));
    } else {
      setExpandedLessons([...expandedLessons, lessonId]);
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
        <h4 className={styles.subSectionTitle}>Lessons List</h4>
        <button
          type="button"
          className={styles.addLessonBtn}
          onClick={onAddLesson}
        >
          <IoAddOutline /> Add Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className={styles.emptyState}>No lessons added yet.</div>
      ) : (
        <div className={styles.lessonsList}>
          {lessons.map((lesson, index) => {
            const isExpanded = expandedLessons.includes(lesson.id);
            const attachmentsCount = lesson.attachments?.length || 0;

            return (
              <div
                key={lesson.id}
                className={styles.lessonWrapperCard}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                style={{ opacity: draggedIndex === index ? 0.4 : 1 }}
              >
                <div className={styles.lessonCardHeader}>
                  <div className={styles.lessonLeft}>
                    <IoReorderTwoOutline
                      className={styles.dragIcon}
                      title="Drag to reorder"
                    />

                    <button
                      type="button"
                      className={styles.lessonExpandBtn}
                      onClick={(e) => toggleLessonExpand(lesson.id, e)}
                      title="Toggle Attachments"
                    >
                      {isExpanded ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </button>

                    <IoPlayCircleOutline className={styles.lessonIcon} />
                    <div className={styles.lessonMeta}>
                      <span className={styles.lessonTitle}>
                        {index + 1}. {lesson.title}
                      </span>
                      {lesson.duration && (
                        <span className={styles.lessonDuration}>
                          <IoTimeOutline /> {lesson.duration} mins
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.lessonRight}>
                    <span
                      className={styles.attachmentBadgeCount}
                      onClick={(e) => toggleLessonExpand(lesson.id, e)}
                    >
                      <IoAttachOutline /> {attachmentsCount} Attachments
                    </span>

                    <button
                      type="button"
                      className={styles.deleteLessonBtn}
                      onClick={() => onDeleteLesson(lesson.id)}
                      title="Delete Lesson"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.attachmentsDrawer}>
                    <div className={styles.drawerHeader}>
                      <h5>
                        <IoAttachOutline /> Lesson Resources & Attachments
                      </h5>
                    </div>

                    <div className={styles.attachmentsGrid}>
                      {lesson.attachments?.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={styles.attachmentItemCard}
                        >
                          <div className={styles.attachmentInfo}>
                            <IoDocumentAttachOutline
                              className={styles.fileIcon}
                            />
                            <div>
                              <p className={styles.fileName}>
                                {attachment.title}
                              </p>
                              <span className={styles.fileMeta}>
                                {attachment.fileName} ({attachment.fileSize})
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            className={styles.deleteAttachmentBtn}
                            onClick={() =>
                              onDeleteAttachment(lesson.id, attachment.id)
                            }
                            title="Remove attachment"
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className={styles.addAttachmentYellowCard}
                        onClick={() => setActiveLessonForAttachment(lesson.id)}
                      >
                        <IoAddOutline className={styles.yellowAddIcon} />
                        <span>Add Attachment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddAttachmentModal
        isOpen={Boolean(activeLessonForAttachment)}
        onClose={() => setActiveLessonForAttachment(null)}
        onSubmit={(attachmentData) => {
          onAddAttachment(activeLessonForAttachment, attachmentData);
          setActiveLessonForAttachment(null);
        }}
      />
    </div>
  );
};

export default LessonList;
