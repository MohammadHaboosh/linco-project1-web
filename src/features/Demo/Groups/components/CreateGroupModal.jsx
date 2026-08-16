import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoCheckmarkCircle,
  IoPeopleOutline,
} from "react-icons/io5";
import { useCreateGroup } from "../hooks/useCreateGroup";
import styles from "./CreateGroupModal.module.css";

const CreateGroupModal = ({ demoId, onClose, onSuccess }) => {
  const { t } = useTranslation();

  const {
    formData,
    handleChange,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    selectedUser,
    selectUser,
    clearSelectedUser,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateGroup(demoId, () => {
    if (onSuccess) onSuccess();
    onClose();
  });

  const getUserDisplayName = (userData) => {
    if (!userData?.user) return t("unknown-user");
    const firstName = userData.user.firstName || "";
    const lastName = userData.user.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || userData.user.email || t("unknown-user");
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-title"
        aria-busy={isSubmitting}
      >
        <div className={styles.header}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <h2 id="create-group-title">
                {t("create-new-group", "Create New Group")}
              </h2>
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
            aria-label={t("close-create-group-dialog", "Close")}
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
            <label htmlFor="group-name">{t("group-name", "Group Name")}</label>
            <input
              id="group-name"
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
            <label htmlFor="group-description">
              {t("group-desc", "Description")}
            </label>
            <textarea
              id="group-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t(
                "group-description-placeholder",
                "What is this group about?",
              )}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("assign-manager", "Assign Manager")}</label>

            {selectedUser ? (
              <div className={styles.selectedUserCard}>
                <div className={styles.userInfo}>
                  {selectedUser.user?.imagePath ? (
                    <img
                      src={selectedUser.user.imagePath}
                      alt={t("member-avatar-alt", {
                        name: getUserDisplayName(selectedUser),
                      })}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {getInitials(getUserDisplayName(selectedUser))}
                    </div>
                  )}

                  <div className={styles.selectedUserDetails}>
                    <span className={styles.selectedUserName}>
                      {getUserDisplayName(selectedUser)}
                      <IoCheckmarkCircle className={styles.successIconBadge} />
                    </span>
                    <span className={styles.selectedUserEmail}>
                      {selectedUser.user?.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.changeUserBtn}
                  onClick={clearSelectedUser}
                  disabled={isSubmitting}
                  aria-label={t("change-group-manager", "Change manager")}
                >
                  {t("change", "Change")}
                </button>
              </div>
            ) : (
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <IoSearchOutline className={styles.searchIcon} />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    placeholder={t(
                      "search-by-name-or-email",
                      "Search by name or email...",
                    )}
                    aria-label={t("search-for-group-manager")}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {isSearching && (
                    <span
                      className={styles.loader}
                      role="status"
                      aria-label={t("searching-members", "Searching...")}
                    />
                  )}
                </div>

                {searchError && !isSearching && (
                  <div className={styles.noResults} role="alert">
                    {searchError}
                  </div>
                )}

                {!searchError &&
                  searchQuery.trim() !== "" &&
                  searchResults.length > 0 && (
                    <ul
                      className={styles.resultsList}
                      aria-label={t("member-search-results")}
                    >
                      {searchResults.map((user) => (
                        <li key={user.id}>
                          <button
                            type="button"
                            className={styles.resultItem}
                            onClick={() => selectUser(user)}
                          >
                            {user.user?.imagePath ? (
                              <img
                                src={user.user.imagePath}
                                alt={t("member-avatar-alt", {
                                  name: getUserDisplayName(user),
                                })}
                                className={styles.avatarImage}
                              />
                            ) : (
                              <div className={styles.avatarPlaceholder}>
                                {getInitials(getUserDisplayName(user))}
                              </div>
                            )}

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

                {!searchError &&
                  searchQuery.trim() !== "" &&
                  searchResults.length === 0 &&
                  !isSearching && (
                    <div className={styles.noResults}>
                      {t("no-users-found", "No users found")}
                    </div>
                  )}
              </div>
            )}
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
