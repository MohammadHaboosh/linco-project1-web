import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoBriefcaseOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useDepartmentMembers } from "../../hooks/useDepartmentMembers";
import AddDepartmentMemberModal from "../AddDepartmentMemberModal/AddDepartmentMemberModal";
import {
  SummaryCardsSkeleton,
  MembersTableSkeleton,
} from "./DepartmentMembersSkeleton";
import styles from "./DepartmentMembersContent.module.css";
import { useAppAlert } from "../../../../../components/common/AppAlerts/useAppAlert";

const ROLE_TRANSLATION_KEYS = {
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  OWNER: "owner",
  SECTION_MANAGER: "section-manager",
  SECTIONMANAGER: "section-manager",
};

const JOB_TITLE_TRANSLATION_KEYS = {
  INTERN: "intern",
  JUNIOR: "junior",
  SENIOR: "senior",
};

const DepartmentMembersContent = () => {
  const { demoId, departmentId } = useParams();
  const { t, i18n } = useTranslation();
  const { confirmAction } = useAppAlert();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const {
    members,
    meta,
    isLoading,
    error,
    deletingMemberId,
    deleteError,
    refetch,
    deleteMember,
  } = useDepartmentMembers(departmentId);
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale),
    [locale],
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return members;

    return members.filter((departmentMember) => {
      const demoMember = departmentMember.demoMember ?? {};
      const user = demoMember.user ?? {};
      const searchableText = [
        user.firstName,
        user.lastName,
        user.email,
        demoMember.role,
        departmentMember.jobTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [members, searchQuery]);

  const summary = useMemo(() => {
    const jobLevels = new Set(
      members.map((member) => member.jobTitle).filter(Boolean),
    ).size;
    const managers = members.filter((member) => {
      const role = String(member.demoMember?.role ?? "").toUpperCase();
      return ["OWNER", "MANAGER", "ADMIN"].includes(role);
    }).length;

    return { jobLevels, managers };
  }, [members]);

  const formatCount = (count) => numberFormatter.format(count);

  const formatDate = (value) => {
    if (!value) return t("not-available");

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("not-available");

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const translateRole = (role) => {
    const normalizedRole = String(role ?? "").toUpperCase();
    return t(ROLE_TRANSLATION_KEYS[normalizedRole] || "member");
  };

  const translateJobTitle = (jobTitle) => {
    const normalizedJobTitle = String(jobTitle ?? "").toUpperCase();
    const translationKey = JOB_TITLE_TRANSLATION_KEYS[normalizedJobTitle];
    return translationKey ? t(translationKey) : t("not-assigned");
  };

  const getRoleClass = (role) => {
    const normalizedRole = String(role ?? "").toUpperCase();

    if (normalizedRole === "OWNER") return styles.ownerBadge;
    if (["MANAGER", "ADMIN"].includes(normalizedRole)) {
      return styles.managerBadge;
    }

    return styles.memberBadge;
  };

  const handleDeleteMember = async (memberId, memberName) => {
    const shouldDelete = await confirmAction({
      message: t("remove-department-member-confirmation", {
        name: memberName,
      }),
      confirmLabel: t("remove"),
      tone: "danger",
    });

    if (!shouldDelete) return;

    await deleteMember(memberId);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoPeopleOutline />
            </div>
            <div>
              <span className={styles.eyebrow}>
                {t("department-management")}
              </span>
              <h1>{t("department-members")}</h1>
              <p>{t("department-members-description")}</p>
            </div>
          </div>

          <button
            type="button"
            className={styles.addMemberButton}
            onClick={() => setIsAddMemberOpen(true)}
            aria-haspopup="dialog"
          >
            <IoPersonAddOutline />
            {t("add-members")}
          </button>
        </header>

        {isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <section
            className={styles.summaryGrid}
            aria-label={t("department-member-summary")}
          >
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <IoPeopleOutline />
              </div>
              <div>
                <span>{t("total-members", "Total members")}</span>
                <strong>{formatCount(members.length)}</strong>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <IoShieldCheckmarkOutline />
              </div>
              <div>
                <span>{t("management-roles")}</span>
                <strong>{formatCount(summary.managers)}</strong>
              </div>
            </div>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <IoBriefcaseOutline />
              </div>
              <div>
                <span>{t("job-levels")}</span>
                <strong>{formatCount(summary.jobLevels)}</strong>
              </div>
            </div>
          </section>
        )}

        <section className={styles.membersPanel}>
          <div className={styles.panelToolbar}>
            <div>
              <h2>{t("members-directory")}</h2>
              <p>
                {searchQuery
                  ? t("members-match-count", {
                      count: filteredMembers.length,
                      formattedCount: formatCount(filteredMembers.length),
                    })
                  : t("department-members-count", {
                      count: members.length,
                      formattedCount: formatCount(members.length),
                    })}
              </p>
            </div>

            <label className={styles.searchBox}>
              <IoSearchOutline />
              <span className={styles.srOnly}>
                {t("search-department-members")}
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("search-members-placeholder")}
              />
            </label>
          </div>

          {deleteError && !isLoading && !error && (
            <div className={styles.mutationError} role="alert">
              {t(deleteError, { defaultValue: deleteError })}
            </div>
          )}

          {error ? (
            <div className={styles.stateMessage} role="alert">
              <div className={styles.stateIcon}>!</div>
              <h3>{t("members-load-failed")}</h3>
              <p>{t(error, { defaultValue: error })}</p>
              {demoId && departmentId && (
                <button type="button" onClick={refetch}>
                  <IoRefreshOutline aria-hidden="true" /> {t("try-again")}
                </button>
              )}
            </div>
          ) : isLoading ? (
            <MembersTableSkeleton />
          ) : filteredMembers.length === 0 ? (
            <div className={styles.stateMessage}>
              <div className={styles.emptyIcon}>
                <IoPeopleOutline />
              </div>
              <h3>
                {searchQuery
                  ? t("no-matching-members")
                  : t("no-department-members")}
              </h3>
              <p>
                {searchQuery
                  ? t("adjust-member-search")
                  : t("department-members-empty-description")}
              </p>
            </div>
          ) : (
            <div className={styles.tableScroller}>
              <table className={styles.membersTable}>
                <caption className={styles.srOnly}>
                  {t("department-members-table-caption")}
                </caption>
                <thead>
                  <tr>
                    <th>{t("member")}</th>
                    <th>{t("job-title")}</th>
                    <th>{t("workspace-role")}</th>
                    <th>{t("assigned")}</th>
                    <th className={styles.actionsColumn}>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((departmentMember) => {
                    const demoMember = departmentMember.demoMember ?? {};
                    const user = demoMember.user ?? {};
                    const fullName =
                      [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      user.email ||
                      t("member");
                    const initials =
                      `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
                      fullName.slice(0, 1).toUpperCase();
                    const isDeleting = deletingMemberId === departmentMember.id;

                    return (
                      <tr key={departmentMember.id}>
                        <td data-label={t("member")}>
                          <div className={styles.memberIdentity}>
                            <div className={styles.avatar}>
                              {user.imagePath ? (
                                <img src={user.imagePath} alt="" />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div>
                              <strong>{fullName}</strong>
                              <span>{user.email || t("not-available")}</span>
                            </div>
                          </div>
                        </td>
                        <td data-label={t("job-title")}>
                          <span className={styles.jobTitle}>
                            <IoBriefcaseOutline aria-hidden="true" />
                            {translateJobTitle(departmentMember.jobTitle)}
                          </span>
                        </td>
                        <td data-label={t("workspace-role")}>
                          <span
                            className={`${styles.roleBadge} ${getRoleClass(demoMember.role)}`}
                          >
                            {translateRole(demoMember.role)}
                          </span>
                        </td>
                        <td
                          className={styles.dateCell}
                          data-label={t("assigned")}
                        >
                          {formatDate(departmentMember.assignedAt)}
                        </td>
                        <td
                          className={styles.actionsColumn}
                          data-label={t("actions")}
                        >
                          <button
                            type="button"
                            className={styles.deleteMemberButton}
                            title={
                              isDeleting
                                ? t("removing-department-member")
                                : t("remove-department-member")
                            }
                            aria-label={
                              isDeleting
                                ? t("removing-named-department-member", {
                                    name: fullName,
                                  })
                                : t("remove-named-department-member", {
                                    name: fullName,
                                  })
                            }
                            onClick={() =>
                              handleDeleteMember(departmentMember.id, fullName)
                            }
                            disabled={Boolean(deletingMemberId)}
                            aria-busy={isDeleting}
                          >
                            <IoTrashOutline aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && members.length > 0 && (
            <div className={styles.panelFooter}>
              <span>
                {t("showing-members", {
                  count: filteredMembers.length,
                  formattedCount: formatCount(filteredMembers.length),
                })}
              </span>
              {meta?.hasNextPage === false && (
                <span className={styles.allLoaded}>
                  {t("all-members-loaded")}
                </span>
              )}
            </div>
          )}
        </section>
      </div>

      {isAddMemberOpen && (
        <AddDepartmentMemberModal
          demoId={demoId}
          departmentId={departmentId}
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

export default DepartmentMembersContent;
