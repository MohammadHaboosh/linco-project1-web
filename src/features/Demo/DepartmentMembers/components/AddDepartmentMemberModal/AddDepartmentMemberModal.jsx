import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  IoBriefcaseOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useAddDepartmentMember } from "../../hooks/useAddDepartmentMember";
import styles from "./AddDepartmentMemberModal.module.css";

const AddDepartmentMemberModal = ({
  demoId,
  departmentId,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedMember,
    selectMember,
    clearSelectedMember,
    jobTitle,
    setJobTitle,
    isSearching,
    searchError,
    isSubmitting,
    submitError,
    submitMember,
  } = useAddDepartmentMember({
    demoId,
    departmentId,
    onSuccess,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const getUser = (member) => member?.user ?? {};

  const getDisplayName = (member) => {
    const user = getUser(member);
    return (
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email ||
      t("member")
    );
  };

  const getInitials = (member) => {
    const user = getUser(member);
    const initials =
      `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

    return initials || <IoPersonOutline />;
  };

  const renderAvatar = (member, className) => {
    const user = getUser(member);

    return (
      <div className={className}>
        {user.imagePath ? (
          <img src={user.imagePath} alt="" />
        ) : (
          <span>{getInitials(member)}</span>
        )}
      </div>
    );
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={styles.modalContainer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-department-member-title"
        aria-describedby="add-department-member-description"
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.titleIcon}>
              <IoPersonAddOutline />
            </div>
            <div>
              <h2 id="add-department-member-title">{t("add-members")}</h2>
              <p id="add-department-member-description">
                {t("add-department-member-description")}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close")}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form
          className={styles.modalBody}
          onSubmit={submitMember}
          aria-busy={isSubmitting}
        >
          {submitError && (
            <div className={styles.errorAlert} role="alert">
              {t(submitError)}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="department-member-search">
              {t("find-demo-member")}
            </label>

            {selectedMember ? (
              <div className={styles.selectedMemberCard}>
                {renderAvatar(selectedMember, styles.selectedAvatar)}
                <div className={styles.memberInfo}>
                  <strong>{getDisplayName(selectedMember)}</strong>
                  <span>
                    {getUser(selectedMember).email || t("not-available")}
                  </span>
                </div>
                <IoCheckmarkCircleOutline className={styles.selectedIcon} />
                <button
                  type="button"
                  className={styles.changeButton}
                  onClick={clearSelectedMember}
                  disabled={isSubmitting}
                >
                  {t("change")}
                </button>
              </div>
            ) : (
              <div className={styles.memberSearch}>
                <div className={styles.searchInputWrapper}>
                  <IoSearchOutline />
                  <input
                    id="department-member-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("search-demo-members-placeholder")}
                    disabled={isSubmitting}
                    autoComplete="off"
                    autoFocus
                  />
                  {isSearching && (
                    <span
                      className={styles.searchLoader}
                      role="status"
                      aria-label={t("searching-workspace-members")}
                    />
                  )}
                </div>

                <div className={styles.searchFeedback} aria-live="polite">
                  {searchError ? (
                    <span className={styles.searchError} role="alert">
                      {t(searchError)}
                    </span>
                  ) : (
                    searchQuery.trim() &&
                    !isSearching &&
                    searchResults.length === 0 && (
                      <span>{t("no-demo-members-found")}</span>
                    )
                  )}
                </div>

                {searchResults.length > 0 && (
                  <ul
                    className={styles.resultsList}
                    aria-label={t("workspace-member-search-results")}
                  >
                    {searchResults.map((member) => (
                      <li key={member.id}>
                        <button
                          type="button"
                          className={styles.resultItem}
                          onClick={() => selectMember(member)}
                          disabled={isSubmitting}
                        >
                          {renderAvatar(member, styles.resultAvatar)}
                          <span className={styles.memberInfo}>
                            <strong>{getDisplayName(member)}</strong>
                            <span>
                              {getUser(member).email || t("not-available")}
                            </span>
                          </span>
                          <span className={styles.demoRole}>
                            {t(
                              String(member.role || "member")
                                .toLowerCase()
                                .replaceAll("_", "-")
                                .replace("sectionmanager", "section-manager"),
                              { defaultValue: t("member") },
                            )}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="department-member-job-title">
              {t("assign-job-title")}
            </label>
            <div className={styles.selectWrapper}>
              <IoBriefcaseOutline />
              <select
                id="department-member-job-title"
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                disabled={isSubmitting}
              >
                <option value="">{t("select-job-title")}</option>
                <option value="INTERN">{t("intern")}</option>
                <option value="JUNIOR">{t("junior")}</option>
                <option value="SENIOR">{t("senior")}</option>
              </select>
            </div>
            <span className={styles.helperText}>
              {t("department-job-title-help")}
            </span>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!selectedMember || !jobTitle || isSubmitting}
            >
              <IoPersonAddOutline />
              {isSubmitting ? t("adding-member") : t("add-member")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentMemberModal;
