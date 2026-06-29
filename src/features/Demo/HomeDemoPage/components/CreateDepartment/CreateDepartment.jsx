import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import styles from "./CreateDepartment.module.css";

const DEMO_MEMBERS = [
  { id: 1, name: "Ahmad Mohammed", email: "ahmad@linco.com" },
  { id: 2, name: "Sarah Ali", email: "sarah@linco.com" },
  { id: 3, name: "Omar Khaled", email: "omar@linco.com" },
  { id: 4, name: "Abrar Abo Auad", email: "abrar@linco.com" },
];

const CreateDepartment = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();

  // حالة الفورم
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: null,
  });

  // حالة حقل البحث عن المدير
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // تصفية الأعضاء بناءً على نص البحث
  const filteredMembers = DEMO_MEMBERS.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // عند كتابة اسم في حقل البحث
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    setFormData((prev) => ({ ...prev, managerId: null })); // تصفير الاختيار إذا تم تعديل النص
  };

  // عند اختيار مدير من القائمة المنسدلة
  const handleSelectManager = (member) => {
    setFormData((prev) => ({ ...prev, managerId: member.id }));
    setSearchQuery(member.name); // وضع اسم المدير المختار في حقل الإدخال
    setIsDropdownOpen(false); // إغلاق القائمة
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Department Data to Submit:", formData);
    // إرسال البيانات للأب (الأب هو من يتصل بالباك إند)
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* إيقاف انتشار الضغطة لكي لا يغلق المودال عند الضغط داخل الكرت */}
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t("create-department")}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* اسم القسم */}
          <div className={styles.formGroup}>
            <label>{t("department-name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="e.g. Front-End Development"
              required
            />
          </div>

          {/* وصف القسم */}
          <div className={styles.formGroup}>
            <label>{t("department-description")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder="Brief description about the department..."
              required
            />
          </div>

          {/* اختيار المدير (Searchable Autocomplete) */}
          <div className={styles.formGroup}>
            <label>{t("department-manager")}</label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setIsDropdownOpen(false)} // يغلق القائمة عند الخروج من الحقل
                className={styles.input}
                placeholder={t("search-manager")}
                required={!formData.managerId} // مطلوب إذا لم يتم تحديد مدير
              />
              <IoSearchOutline className={styles.searchIcon} />

              {/* القائمة المنسدلة */}
              {isDropdownOpen && (
                <ul className={styles.dropdownList}>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <li
                        key={member.id}
                        className={styles.dropdownItem}
                        // استخدمنا onMouseDown بدلاً من onClick لأنها تتنفذ قبل onBlur الخاص بحقل الإدخال
                        onMouseDown={() => handleSelectManager(member)}
                      >
                        <div className={styles.memberAvatar}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.memberName}>{member.name}</div>
                          <div className={styles.memberEmail}>
                            {member.email}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noResults}>
                      {t("no-members-found")}
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* أزرار الإلغاء والإنشاء */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button type="submit" className={styles.submitBtn}>
              {t("create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;
