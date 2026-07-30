// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { IoArrowBackOutline, IoAddCircleOutline } from "react-icons/io5";
// import { useCourseBuilder } from "../../hooks/useCourseBuilder";
// import CourseDetailsPanel from "./CourseDetailsPanel";
// import SectionAccordion from "./SectionAccordion";
// import LessonModal from "./LessonModal";
// import styles from "./CourseBuilder.module.css";

// const CourseBuilder = ({ onBack }) => {
//   const { t } = useTranslation();

//   const {
//     courseDetails,
//     setCourseDetails,
//     sections,
//     isLoading,
//     addSection,
//     deleteSection,
//     toggleSection,
//     updateSectionTitle,
//     deleteLesson,
//     saveLesson,
//     handleSaveCourse,
//   } = useCourseBuilder();

//   // حالة التحكم بظهور نافذة الدرس
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     sIndex: null,
//     lIndex: null,
//     data: null,
//   });

//   const closeLessonModal = () =>
//     setModalState({ isOpen: false, sIndex: null, lIndex: null, data: null });

//   return (
//     <div className={styles.container}>
//       <header className={styles.header}>
//         <button onClick={onBack} className={styles.backBtn}>
//           <IoArrowBackOutline /> {t("back-to-courses")}
//         </button>
//         <h1 className={styles.pageTitle}>{t("course-builder")}</h1>
//       </header>

//       <div className={styles.layout}>
//         {/* العمود الأيسر */}
//         <div className={styles.leftColumn}>
//           <CourseDetailsPanel
//             details={courseDetails}
//             setDetails={setCourseDetails}
//             onSave={handleSaveCourse}
//             isLoading={isLoading}
//           />
//         </div>

//         {/* العمود الأيمن */}
//         <div className={styles.rightColumn}>
//           <div className={styles.sectionsContainer}>
//             {sections.map((section, sIndex) => (
//               <SectionAccordion
//                 key={section.id}
//                 section={section}
//                 sIndex={sIndex}
//                 onToggle={() => toggleSection(sIndex)}
//                 onUpdateTitle={(val) => updateSectionTitle(sIndex, val)}
//                 onDelete={() => deleteSection(sIndex)}
//                 onAddLesson={() =>
//                   setModalState({
//                     isOpen: true,
//                     sIndex,
//                     lIndex: null,
//                     data: null,
//                   })
//                 }
//                 onEditLesson={(lIndex, data) =>
//                   setModalState({ isOpen: true, sIndex, lIndex, data })
//                 }
//                 onDeleteLesson={(lIndex) => deleteLesson(sIndex, lIndex)}
//               />
//             ))}
//           </div>
//           <button className={styles.addSectionBtn} onClick={addSection}>
//             <IoAddCircleOutline /> {t("add-new-section")}
//           </button>
//         </div>
//       </div>

//       {modalState.isOpen && (
//         <LessonModal
//           defaultData={modalState.data}
//           onClose={closeLessonModal}
//           onSave={(data) => {
//             saveLesson(modalState.sIndex, modalState.lIndex, data);
//             closeLessonModal();
//           }}
//         />
//       )}
//     </div>
//   );
// };
// export default CourseBuilder;
