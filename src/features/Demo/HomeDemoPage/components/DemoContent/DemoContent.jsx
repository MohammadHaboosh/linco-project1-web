import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoAdd,
  IoAlertCircleOutline,
  IoBusinessOutline,
  IoRefreshOutline,
} from "react-icons/io5";

import DemoHeaderSection from "./sections/DemoHeaderSection/DemoHeaderSection";
import SectionCard from "./sections/SectionCard/SectionCard";
import SectionCardSkeleton from "./sections/SectionCard/SectionCardSkeleton";
import CreateDepartment from "../CreateDepartment/CreateDepartment";
import { useDepartments } from "../../hooks/useDepartments";

import styles from "./DemoContent.module.css";
import { useDeleteDepartment } from "../../hooks/useDeleteDepartment";
import { useDemo } from "../../../../../hooks/useDemo";

const DemoContent = () => {
  const { t, i18n } = useTranslation();

  const { demoId } = useParams();
  const { role } = useDemo();
  const { departments, isLoading, error, refetch } = useDepartments(demoId);
  const {
    deleteDepartment,
    isDeleting,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteDepartment(demoId, () => {
    refetch();
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteSection = async (id) => deleteDepartment(id);
  const normalizedSearch = searchQuery
    .trim()
    .toLocaleLowerCase(i18n.resolvedLanguage || i18n.language || "en");
  const filteredDepartments = normalizedSearch
    ? departments.filter((department) =>
        [department.title, department.name, department.description].some(
          (value) =>
            String(value || "")
              .toLocaleLowerCase(i18n.resolvedLanguage || i18n.language || "en")
              .includes(normalizedSearch),
        ),
      )
    : departments;

  return (
    <div className={styles.contentArea} dir={i18n.dir()}>
      <div className={styles.innerContainer}>
        <DemoHeaderSection
          title={t("training-departments")}
          subtitle={t(
            "select-your-specialized-department-to-unlock-tailored-road-maps",
          )}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {deleteError && (
          <div className={styles.inlineError} role="alert">
            <IoAlertCircleOutline aria-hidden="true" />
            <span>{deleteError}</span>
            <button type="button" onClick={clearDeleteError}>
              {t("dismiss-message")}
            </button>
          </div>
        )}

        <div
          className={styles.sectionsGrid}
          aria-busy={isLoading || isDeleting}
        >
          {role === "owner" && !normalizedSearch && (
            <button
              type="button"
              className={styles.createSectionCard}
              onClick={() => setShowCreateModal(true)}
            >
              <IoAdd className={styles.addIcon} aria-hidden="true" />
              <h3>{t("create-new-department")}</h3>
            </button>
          )}

          {isLoading &&
            Array(role === "owner" ? 5 : 6)
              .fill(0)
              .map((_, idx) => <SectionCardSkeleton key={`skeleton-${idx}`} />)}

          {!isLoading && error && (
            <div
              className={`${styles.pageState} ${styles.errorState}`}
              role="alert"
            >
              <IoAlertCircleOutline aria-hidden="true" />
              <h2>{t("departments-load-failed")}</h2>
              <p>{error}</p>
              <button type="button" onClick={refetch}>
                <IoRefreshOutline aria-hidden="true" /> {t("try-again")}
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredDepartments.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                isOwner={role === "owner"}
                onDelete={handleDeleteSection}
                isDeleting={isDeleting}
              />
            ))}

          {!isLoading && !error && filteredDepartments.length === 0 && (
            <div className={styles.emptyState} role="status">
              <IoBusinessOutline aria-hidden="true" />
              <h2>
                {normalizedSearch
                  ? t("no-departments-match-search")
                  : t("no-departments-yet")}
              </h2>
              <p>
                {normalizedSearch
                  ? t("adjust-department-search")
                  : t("departments-empty-description")}
              </p>
              {normalizedSearch && (
                <button type="button" onClick={() => setSearchQuery("")}>
                  {t("clear-search")}
                </button>
              )}
            </div>
          )}
        </div>

        {showCreateModal && (
          <CreateDepartment
            demoId={demoId}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              refetch();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DemoContent;
