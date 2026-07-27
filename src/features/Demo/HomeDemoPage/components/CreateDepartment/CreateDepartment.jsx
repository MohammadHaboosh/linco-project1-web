import { useTranslation } from "react-i18next";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoPersonOutline,
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
    selectedUser,
    setSelectedUser,
    isSubmitting,
    error,
    handleSubmit,
  } = useCreateDepartment(demoId, () => {
    if (onSuccess) onSuccess();
    onClose();
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{t("create-new-department")}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.body}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.formGroup}>
            <label>{t("department-title")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. Back-End Engineering"
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("department-desc")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Brief description about this department..."
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("Assign Manager / Member")}</label>

            {selectedUser ? (
              <div className={styles.selectedUserCard}>
                <div className={styles.userInfo}>
                  <IoCheckmarkCircle className={styles.successIcon} />
                  <span>
                    {selectedUser.user.firstName} {selectedUser.user.lastName}
                  </span>
                  <span>{selectedUser.user.email}</span>
                </div>
                <button
                  className={styles.changeUserBtn}
                  onClick={() => setSelectedUser(null)}
                  disabled={isSubmitting}
                >
                  {t("change")}
                </button>
              </div>
            ) : (
              <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                  <IoSearchOutline className={styles.searchIcon} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    placeholder={t('search-by-name')}
                  />
                  {isSearching && <span className={styles.loader}>...</span>}
                </div>

                {searchQuery.trim() !== "" && searchResults.length > 0 && (
                  <ul className={styles.resultsList}>
                    {console.log(searchResults)}
                    {console.log(searchResults[0].id)}
                    {console.log(searchResults[0].firstName)}
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        className={styles.resultItem}
                        onClick={() => {
                          setSelectedUser(user);
                          setSearchQuery("");
                        }}
                      >
                        {console.log(user)}
                        <IoPersonOutline className={styles.userIcon} />
                        <div>
                          <p className={styles.resultName}>
                            {user.user.firstName} {user.user.lastName}
                          </p>
                          <p className={styles.resultEmail}>
                            {user.user.email}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {searchQuery.trim() !== "" &&
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
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("creating", "Creating...")
              : t("create-department", "Create Department")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;
