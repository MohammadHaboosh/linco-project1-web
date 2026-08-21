import {
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useInviteMember } from "../../hooks/useInviteMember";
import styles from "./InviteModal.module.css";

const InviteModal = ({ demoId, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedUser,
    selectUser,
    clearSelectedUser,
    isSearching,
    searchError,
    isSubmitting,
    submitError,
    sendInvitation,
  } = useInviteMember(demoId, onSuccess);

  const getInitials = (user) => {
    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;
    return initials.toUpperCase() || <IoPersonOutline />;
  };

  const renderAvatar = (user, className) => (
    <div className={className}>
      {user.imagePath ? (
        <img src={user.imagePath} alt="" />
      ) : (
        <span>{getInitials(user)}</span>
      )}
    </div>
  );

  return (
    <div className={styles.modalOverlay} role="presentation">
      <div
        className={styles.modalContainer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
      >
        <div className={styles.modalHeader}>
          <h2 id="invite-member-title">{t("invite-new-member")}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close-invite-member-dialog")}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={sendInvitation} className={styles.modalBody}>
          {submitError && (
            <div className={styles.errorAlert} role="alert">
              {submitError}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="invite-user-search">{t("find-user")}</label>

            {selectedUser ? (
              <div className={styles.selectedUserCard}>
                {renderAvatar(selectedUser, styles.selectedAvatar)}
                <div className={styles.selectedUserInfo}>
                  <strong>
                    {[selectedUser.firstName, selectedUser.lastName]
                      .filter(Boolean)
                      .join(" ") || t("member")}
                  </strong>
                  <span>{selectedUser.email}</span>
                </div>
                <IoCheckmarkCircleOutline className={styles.selectedIcon} />
                <button
                  type="button"
                  className={styles.changeUserBtn}
                  onClick={clearSelectedUser}
                  disabled={isSubmitting}
                >
                  {t("change")}
                </button>
              </div>
            ) : (
              <div className={styles.userSearch}>
                <div className={styles.inputWrapper}>
                  <IoSearchOutline className={styles.inputIcon} />
                  <input
                    id="invite-user-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t(
                      "search-by-name-or-email",
                    )}
                    disabled={isSubmitting}
                    autoComplete="off"
                    autoFocus
                  />
                  {isSearching && (
                    <span
                      className={styles.searchLoader}
                      role="status"
                      aria-label={t("searching-for-users")}
                    />
                  )}
                </div>

                <div className={styles.searchFeedback} aria-live="polite">
                  {searchError && (
                    <span className={styles.searchError}>{searchError}</span>
                  )}
                  {!searchError &&
                    searchQuery.trim() &&
                    !isSearching &&
                    searchResults.length === 0 && (
                      <span>{t("no-users-found")}</span>
                    )}
                </div>

                {searchResults.length > 0 && (
                  <ul className={styles.resultsList}>
                    {searchResults.map((user) => (
                      <li key={user.id}>
                        <button
                          type="button"
                          className={styles.resultItem}
                          onClick={() => selectUser(user)}
                          disabled={isSubmitting}
                        >
                          {renderAvatar(user, styles.resultAvatar)}
                          <span className={styles.resultInfo}>
                            <strong>
                              {[user.firstName, user.lastName]
                                .filter(Boolean)
                                .join(" ") || t("member")}
                            </strong>
                            <span>{user.email}</span>
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
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!selectedUser || isSubmitting}
            >
              {isSubmitting
                ? t("sending-invitation")
                : t("send-invitation")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
