import React from "react";
import {
  IoVideocamOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoDocumentAttachOutline,
} from "react-icons/io5";

const LessonItem = ({
  lesson,
  lIndex,
  sectionId,
  draggedLessonIdx,
  draggedSectionId,
  handleDragStart,
  handleDrop,
  onEdit,
  onDelete,
  styles,
}) => {
  return (
    <div
      className={`${styles.lessonItem} ${
        draggedLessonIdx === lIndex && draggedSectionId === sectionId
          ? styles.dragging
          : ""
      }`}
      draggable
      onDragStart={(e) => handleDragStart(e, sectionId, lIndex)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, sectionId, lIndex)}
    >
      <div className={styles.lessonLeft}>
        <span className={styles.dragHandle} title="Drag to reorder">
          ⋮⋮
        </span>
        <div className={styles.typeIconWrapper}>
          <IoVideocamOutline />
        </div>
        <div className={styles.itemDetails}>
          <span className={styles.itemTitle}>{lesson.title}</span>
          {lesson.pdfs?.length > 0 && (
            <span className={styles.attachmentBadge}>
              <IoDocumentAttachOutline /> {lesson.pdfs.length} files
            </span>
          )}
        </div>
      </div>
      <div className={styles.lessonRight}>
        <button className={styles.iconBtn} onClick={onEdit} title="Edit Lesson">
          <IoPencilOutline />
        </button>
        <button
          className={styles.iconBtnDanger}
          onClick={onDelete}
          title="Delete Lesson"
        >
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
};

export default LessonItem;
