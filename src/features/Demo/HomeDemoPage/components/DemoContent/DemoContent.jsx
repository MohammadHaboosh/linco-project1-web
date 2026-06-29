import { useState } from "react";
import DemoHeaderSection from "./sections/DemoHeaderSection/DemoHeaderSection";
import SectionCard from "./sections/SectionCard/SectionCard";
import CreateDepartment from "../CreateDepartment/CreateDepartment.jsx";
import ProjectChatsWidget from "./sections/ProjectChatsWidget/ProjectChatsWidget";
import styles from "./DemoContent.module.css";
import { IoAdd } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const DemoContent = () => {
  const { t } = useTranslation();
  const isOwner = true;

  const initialSections = [
    {
      id: 1,
      title: "Front-End Development",
      description: "Master React, TypeScript, and modern UI libraries.",
      progress: 45,
      tags: ["React", "TypeScript", "Tailwind"],
      coursesCount: 16,
      membersCount: 120,
      isLocked: false,
    },
    {
      id: 2,
      title: "Back-End Development",
      description: "Learn Node.js, Express, and Database design.",
      progress: 12,
      tags: ["Node.js", "Express", "MongoDB"],
      coursesCount: 14,
      membersCount: 85,
      isLocked: false,
    },
    {
      id: 3,
      title: "UI/UX Design",
      description:
        "Understand user research and creating pixel-perfect designs.",
      progress: 0,
      tags: ["Figma", "Research", "Prototyping"],
      coursesCount: 8,
      membersCount: 200,
      isLocked: true,
    },
    {
      id: 4,
      title: "DevOps Engineering",
      description: "Automate deployments, manage CI/CD pipelines.",
      progress: 0,
      tags: ["Docker", "AWS", "CI/CD"],
      coursesCount: 10,
      membersCount: 45,
      isLocked: true,
    },
  ];

  const [sectionsData, setSectionsData] = useState(initialSections);

  const handleDeleteSection = (id) => {
    const updatedSections = sectionsData.filter((section) => section.id !== id);
    setSectionsData(updatedSections);
    console.log("Section Deleted:", id);
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  return (
    <div className={styles.contentArea}>
      <div className={styles.innerContainer}>
        <DemoHeaderSection
          title={t("training-sections")}
          subtitle={t(
            "select-your-specialized-department-to-unlock-tailored-road-maps",
          )}
        />

        <div className={styles.sectionsGrid}>
          {isOwner && (
            <div
              className={styles.createSectionCard}
              onClick={() => setShowCreateModal(true)}
            >
              <IoAdd className={styles.addIcon} />
              <h3>{t("create-new-section")}</h3>
            </div>
          )}
          {showCreateModal && (
            <CreateDepartment
              onClose={() => setShowCreateModal(false)}
              onSubmit={(data) => {
                console.log("Data saved:", data);
                setShowCreateModal(false);
              }}
            />
          )}

          {sectionsData.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isOwner={isOwner}
              onDelete={handleDeleteSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoContent;
