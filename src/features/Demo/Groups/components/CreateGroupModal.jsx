import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoPeopleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useCreateGroup } from "../hooks/useCreateGroup";
import styles from "./CreateGroupModal.module.css";

const CreateGroupModal = ({ demoId, currentUserId, onClose, onSuccess }) => {
  const { t } = useTranslation();

  const {
    formData,
    handleChange,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    selectedMembers,
    toggleMember,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateGroup(demoId, currentUserId, () => {
    if (onSuccess) onSuccess();
    onClose();
  });

  const getUserDisplayName = (userData) => {
    if (!userData?.user) return t("unknown-user");
    const fullName =
      `${userData.user.firstName || ""} ${userData.user.lastName || ""}`.trim();
    return fullName || userData.user.email || t("unknown-user");
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className={styles.header}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <h2>{t("create-new-group", "Create New Group")}</h2>
              <p>
                {t(
                  "create-group-desc",
                  "Setup a dedicated workspace for your team.",
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>{t("group-name", "Group Name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder={t("group-name-placeholder", "e.g. Back-End Team")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("group-desc", "Description")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("add-members", "Add Members (Optional)")}</label>

            {selectedMembers.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "var(--app-info-surface)",
                      border: "1px solid var(--app-info-border)",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                    }}
                  >
                    {getUserDisplayName(member)}
                    <IoCloseOutline
                      style={{ cursor: "pointer", fontSize: "1.1rem" }}
                      onClick={() => toggleMember(member)}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className={styles.searchContainer}>
              <div className={styles.searchBox}>
                <IoSearchOutline className={styles.searchIcon} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  placeholder={t(
                    "search-members-placeholder",
                    "Search members to add...",
                  )}
                  disabled={isSubmitting}
                />
                {isSearching && <span className={styles.loader} />}
              </div>

              {searchQuery.trim() !== "" && searchResults.length > 0 && (
                <ul className={styles.resultsList}>
                  {searchResults.map((user) => (
                    <li key={user.id}>
                      <button
                        type="button"
                        className={styles.resultItem}
                        onClick={() => toggleMember(user)}
                      >
                        <div className={styles.avatarPlaceholder}>
                          {getInitials(getUserDisplayName(user))}
                        </div>
                        <div className={styles.resultTextData}>
                          <p className={styles.resultName}>
                            {getUserDisplayName(user)}
                          </p>
                          <p className={styles.resultEmail}>
                            {user.user?.email}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting
              ? t("creating-group", "Creating...")
              : t("create-group", "Create Group")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
