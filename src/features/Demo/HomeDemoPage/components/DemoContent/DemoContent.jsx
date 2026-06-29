import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoAdd } from "react-icons/io5";

import DemoHeaderSection from "./sections/DemoHeaderSection/DemoHeaderSection";
import SectionCard from "./sections/SectionCard/SectionCard";
import CreateDepartment from "../CreateDepartment/CreateDepartment";
import { useDepartments } from "../../hooks/useDepartments";

import styles from "./DemoContent.module.css";

const DemoContent = () => {
  const { t } = useTranslation();
  const isOwner = true;

  const { demoId } = useParams();

  const { departments, isLoading, error, refetch } = useDepartments(demoId);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleDeleteSection = (id) => {
    ///// TODO:
    console.log("Section Deleted:", id);
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.innerContainer}>
        <DemoHeaderSection
          title={t("training-sections")}
          subtitle={t(
            "select-your-specialized-department-to-unlock-tailored-road-maps",
          )}
        />

        {isLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#1a56db",
              fontWeight: "bold",
            }}
          >
            {t("loading-departments", "Loading departments...")}
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#ef4444",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        ) : (
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
                demoId={demoId}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                  console.log("Department created successfully!");
                  setShowCreateModal(false);
                  refetch();
                }}
              />
            )}

            {departments.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isOwner={isOwner}
                onDelete={handleDeleteSection}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoContent;
