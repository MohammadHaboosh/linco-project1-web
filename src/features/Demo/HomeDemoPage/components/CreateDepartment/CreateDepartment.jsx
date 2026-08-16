import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { useCreateDepartment } from "../../hooks/useCreateDepartment";
import styles from "./CreateDepartment.module.css";

const CreateDepartment = ({ demoId, onClose, onSuccess }) => {
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
  } = useCreateDepartment(demoId, () => {
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
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-department-title"
        aria-busy={isSubmitting}
      >
        <div className={styles.header}>
          <h3 id="create-department-title">{t("create-new-department")}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close-create-department-dialog")}
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
            <label htmlFor="department-name">{t("department-title")}</label>
            <input
              id="department-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder={t("department-title-placeholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="department-description">
              {t("department-desc")}
            </label>
            <textarea
              id="department-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t("department-description-placeholder")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("assign-manager")}</label>

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
                  aria-label={t("change-department-manager")}
                >
                  {t("change")}
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
                    placeholder={t("search-by-name-or-email")}
                    aria-label={t("search-for-department-manager")}
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {isSearching && (
                    <span
                      className={styles.loader}
                      role="status"
                      aria-label={t("searching-members")}
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
                      {t("no-users-found")}
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
            {t("cancel")}
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting
              ? t("creating-department")
              : t("create-department")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;
