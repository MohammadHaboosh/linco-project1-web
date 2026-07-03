import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoMailUnreadOutline,
  IoSearchOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import InvitationCard from "../../../../components/elements/InvitationCard/InvitationCard";
import styles from "./PendingInvitations.module.css";

const PendingInvitationsContent = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================
  // 💡 اللوجيك الخاص بك: استبدل هذه المصفوفة بالـ Hook الخاص بك لجلب البيانات
  // مثال: const { invitations, isLoading, acceptInvite, rejectInvite } = usePendingInvitations();
  // =========================================================
  const [invitations, setInvitations] = useState([
    {
      id: 1,
      company: "Google Workspace",
      caller: "Ahmad Sami",
      role: "Trainee",
      time: "10:30 AM",
    },
    {
      id: 2,
      company: "Microsoft Team",
      caller: "Sara Majed",
      role: "Section Manager",
      time: "Yesterday",
    },
  ]);

  // دالة البحث (تعمل محلياً على تصفية المصفوفة)
  const filteredInvitations = invitations.filter(
    (inv) =>
      inv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.caller.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={styles.pageContainer}>
      {/* 1. الترويسة الفخمة */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.iconBox}>
            <IoMailUnreadOutline className={styles.headerIcon} />
            {invitations.length > 0 && (
              <span className={styles.badge}>{invitations.length}</span>
            )}
          </div>
          <div>
            <h1 className={styles.title}>
              {t("pending-invitations", "Pending Invitations")}
            </h1>
            <p className={styles.description}>
              {t(
                "review-and-manage-invitations",
                "Review and manage your workspace invitations. Accept to join or reject to decline.",
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. شريط البحث والأدوات */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t(
              "search-invitations",
              "Search by company or sender name...",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* 3. قائمة الدعوات */}
      <div className={styles.listSection}>
        {filteredInvitations.length === 0 ? (
          // حالة عدم وجود دعوات (Empty State)
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <IoCheckmarkDoneOutline />
            </div>
            <h3>{t("all-caught-up", "You're all caught up!")}</h3>
            <p>
              {t(
                "no-pending-invitations",
                "You don't have any pending invitations matching your search at the moment.",
              )}
            </p>
          </div>
        ) : (
          <div className={styles.invitationsGrid}>
            {filteredInvitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                compact={false} // 💡 تأكد من أن compact=false ليعرض التصميم العريض الخاص بالصفحة
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingInvitationsContent;
