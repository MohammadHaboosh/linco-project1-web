import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoPeopleOutline,
  IoTrashOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import { useDepartmentMembers } from "../../DepartmentMembers/hooks/useDepartmentMembers";
import { departmentMemberApi } from "../../DepartmentMembers/api/departmentMemberApi";
import AddDepartmentMemberModal from "../../DepartmentMembers/components/AddDepartmentMemberModal/AddDepartmentMemberModal";
import styles from "./Groups.module.css";

const GroupMembersPanel = ({ demoId, groupId, isManager }) => {
  const { t } = useTranslation();
  const { members, isLoading, refetch } = useDepartmentMembers(groupId); // API يدعم الغروبات كأقسام
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveMember = async (memberId) => {
    if (
      !window.confirm(
        t(
          "confirm-remove-member",
          "Are you sure you want to remove this member?",
        ),
      )
    )
      return;
    setIsDeleting(true);
    try {
      await departmentMemberApi.removeMember({
        demoId,
        departmentId: groupId,
        memberId,
      });
      await refetch();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--app-muted)",
        }}
      >
        {t("loading", "Loading...")}
      </div>
    );

  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        backgroundColor: "var(--app-page-bg)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            color: "var(--app-heading)",
          }}
        >
          <IoPeopleOutline /> {t("group-members", "Group Members")} (
          {members.length})
        </h2>
        {isManager && (
          <button
            onClick={() => setIsAddMemberOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--app-link)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <IoPersonAddOutline /> {t("add-members", "Add Members")}
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {members.map((member) => {
          const user = member.demoMember?.user || {};
          const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email;
          const initials = fullName.substring(0, 2).toUpperCase();

          return (
            <div
              key={member.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                background: "var(--app-surface)",
                border: "1px solid var(--app-border)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "var(--app-info-surface)",
                    color: "var(--app-link)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {initials}
                </div>
                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "var(--app-text-strong)",
                    }}
                  >
                    {fullName}
                  </strong>
                  <span
                    style={{ fontSize: "0.8rem", color: "var(--app-muted)" }}
                  >
                    {user.email}
                  </span>
                </div>
              </div>

              {isManager && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={isDeleting}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--app-danger-text)",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    padding: "8px",
                  }}
                  title={t("remove", "Remove")}
                >
                  <IoTrashOutline />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isAddMemberOpen && (
        <AddDepartmentMemberModal
          demoId={demoId}
          departmentId={groupId}
          onClose={() => setIsAddMemberOpen(false)}
          onSuccess={async () => {
            await refetch();
            setIsAddMemberOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GroupMembersPanel;
