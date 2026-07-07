import { useState } from "react";
import { IoCloseOutline, IoSendOutline } from "react-icons/io5";
import styles from "../Inquiries.module.css";

const NewInquiryModal = ({ onClose, onSend }) => {
  const [formData, setFormData] = useState({
    to: "Owner",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!formData.subject || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }
    onSend(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>Submit New Inquiry</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>Recipient *</label>
            <select
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            >
              <option value="Owner">Workspace Owner (General issues)</option>
              <option value="Front-End Manager">Front-End Manager</option>
              <option value="UI/UX Manager">UI/UX Manager</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Subject *</label>
            <input
              type="text"
              placeholder="e.g. Missing Certificate"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Message *</label>
            <textarea
              rows="5"
              placeholder="Describe your issue in detail..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <IoSendOutline /> Send Inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewInquiryModal;
