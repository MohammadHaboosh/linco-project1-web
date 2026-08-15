import { useState } from "react";
import {
  IoCloseOutline,
  IoSearchOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";

const CreateGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Create New Chat Group</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Group Name</label>
            <input
              type="text"
              placeholder="e.g. Frontend Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Add Members (Search)</label>
            <div className={styles.searchBox}>
              <IoSearchOutline className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.mockSearchResults}>
              <p className={styles.hintText}>No users selected yet.</p>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitBtn}>Create Group</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
