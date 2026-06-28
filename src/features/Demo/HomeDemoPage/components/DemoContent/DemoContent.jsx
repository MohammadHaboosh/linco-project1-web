import { useState } from "react";
import DemoHeaderSection from "./sections/DemoHeaderSection/DemoHeaderSection";
import SectionCard from "./sections/SectionCard/SectionCard";
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

  const recentChats = [
    {
      id: 1,
      projectName: "E-Commerce App",
      lastMessage: "Sarah: I pushed the new navbar updates.",
      time: "10:30 AM",
      unread: 2,
      avatarColor: "#1a56db",
    },
    {
      id: 2,
      projectName: "Dashboard UI",
      lastMessage: "You: Let's review the API structure.",
      time: "Yesterday",
      unread: 0,
      avatarColor: "#9f1239",
    },
    {
      id: 3,
      projectName: "LinCo Landing",
      lastMessage: "Ahmad: Needs more padding on mobile.",
      time: "Yesterday",
      unread: 5,
      avatarColor: "#059669",
    },
    {
      id: 4,
      projectName: "Auth System",
      lastMessage: "Omar: JWT is implemented successfully.",
      time: "Mon",
      unread: 0,
      avatarColor: "#d97706",
    },
  ];

  return (
    <div className={styles.contentArea}>
      <div className={styles.innerContainer}>
        <DemoHeaderSection
          title={t("training-sections")}
          subtitle={t(
            "select-your-specialized-department-to-unlock-tailored-road-maps",
          )}
        />

        <div className={styles.mainLayout}>
          <div className={styles.sectionsGrid}>
            {isOwner && (
              <div
                className={styles.createSectionCard}
                onClick={() => console.log("Open Add Modal")}
              >
                <IoAdd className={styles.addIcon} />
                <h3>{t("create-new-section")}</h3>
              </div>
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

          <div className={styles.chatsSidebar}>
            <ProjectChatsWidget chats={recentChats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoContent;
