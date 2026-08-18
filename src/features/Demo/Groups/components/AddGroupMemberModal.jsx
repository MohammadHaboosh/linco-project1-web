import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useAddDepartmentMember } from "../../DepartmentMembers/hooks/useAddDepartmentMember";
import styles from "../../DepartmentMembers/components/AddDepartmentMemberModal/AddDepartmentMemberModal.module.css";

const AddGroupMemberModal = ({ demoId, groupId, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedMember,
    selectMember,
    clearSelectedMember,
    setJobTitle,
    isSearching,
    searchError,
    isSubmitting,
    submitError,
    submitMember,
  } = useAddDepartmentMember({
    demoId,
    departmentId: groupId,
    onSuccess,
  });

  useEffect(() => {
    setJobTitle("INTERN");
  }, [setJobTitle]);

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
      <div className={className} style={{ overflow: "hidden" }}>
        {user.imagePath ? (
          <img
            src={user.imagePath}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
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
      <div className={styles.modalContainer} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.titleIcon}>
              <IoPersonAddOutline />
            </div>
            <div>
              <h2>{t("add-members")}</h2>
              <p>
                {t(
                  "add-group-member-description",
                  "Search and add members to this group.",
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={submitMember}>
          {submitError && (
            <div className={styles.errorAlert} role="alert">
              {t(submitError)}
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label>{t("find-demo-member")}</label>

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
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("search-demo-members-placeholder")}
                    disabled={isSubmitting}
                    autoComplete="off"
                    autoFocus
                  />
                  {isSearching && <span className={styles.searchLoader} />}
                </div>

                <div className={styles.searchFeedback}>
                  {searchError ? (
                    <span className={styles.searchError}>{t(searchError)}</span>
                  ) : (
                    searchQuery.trim() &&
                    !isSearching &&
                    searchResults.length === 0 && (
                      <span>{t("no-demo-members-found")}</span>
                    )
                  )}
                </div>

                {searchResults.length > 0 && (
                  <ul className={styles.resultsList}>
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
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
              disabled={!selectedMember || isSubmitting}
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

export default AddGroupMemberModal;
