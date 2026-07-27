import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IoBriefcaseOutline,
  IoPeopleOutline,
  IoRefreshOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { useDepartmentMembers } from "../../hooks/useDepartmentMembers";
import styles from "./DepartmentMembersContent.module.css";

const normalizeLabel = (value, fallback = "—") => {
  if (!value) return fallback;

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const DepartmentMembersContent = () => {
  const { departmentId } = useParams();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const { members, meta, isLoading, error, refetch } =
    useDepartmentMembers(departmentId);

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

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(
      i18n.resolvedLanguage || i18n.language || "en",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    ).format(date);
  };

  const getRoleClass = (role) => {
    const normalizedRole = String(role ?? "").toUpperCase();

    if (normalizedRole === "OWNER") return styles.ownerBadge;
    if (["MANAGER", "ADMIN"].includes(normalizedRole)) {
      return styles.managerBadge;
    }

    return styles.memberBadge;
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
            className={styles.refreshButton}
            onClick={refetch}
            disabled={isLoading}
          >
            <IoRefreshOutline className={isLoading ? styles.spinning : ""} />
            {t("refresh", "Refresh")}
          </button>
        </header>

        <section className={styles.summaryGrid} aria-label="Member summary">
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <span>{t("total-members", "Total members")}</span>
              <strong>{members.length}</strong>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <IoShieldCheckmarkOutline />
            </div>
            <div>
              <span>{t("management-roles")}</span>
              <strong>{summary.managers}</strong>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <IoBriefcaseOutline />
            </div>
            <div>
              <span>{t("job-levels")}</span>
              <strong>{summary.jobLevels}</strong>
            </div>
          </div>
        </section>

        <section className={styles.membersPanel}>
          <div className={styles.panelToolbar}>
            <div>
              <h2>{t("members-directory")}</h2>
              <p>
                {searchQuery
                  ? t("members-match-count", {
                      count: filteredMembers.length,
                      defaultValue: "{{count}} matching members",
                    })
                  : t("department-members-count", {
                      count: members.length,
                      defaultValue: "{{count}} members in this department",
                    })}
              </p>
            </div>

            <label className={styles.searchBox}>
              <IoSearchOutline />
              <span className={styles.srOnly}>
                {t("search-department-members", "Search department members")}
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t(
                  "search-members-placeholder",
                  "Search name, email, role, or job title",
                )}
              />
            </label>
          </div>

          {error ? (
            <div className={styles.stateMessage} role="alert">
              <div className={styles.stateIcon}>!</div>
              <h3>{t("members-load-failed")}</h3>
              <p>{error}</p>
              <button type="button" onClick={refetch}>
                <IoRefreshOutline /> {t("try-again")}
              </button>
            </div>
          ) : isLoading ? (
            <div className={styles.loadingState} aria-live="polite">
              <span className={styles.loader} />
              <p>
                {t(
                  "loading-department-members",
                  "Loading department members...",
                )}
              </p>
            </div>
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
                <thead>
                  <tr>
                    <th>{t("member")}</th>
                    <th>{t("job-title")}</th>
                    <th>{t("workspace-role")}</th>
                    <th>{t("assigned")}</th>
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

                    return (
                      <tr key={departmentMember.id}>
                        <td>
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
                              <span>{user.email || "—"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={styles.jobTitle}>
                            <IoBriefcaseOutline />
                            {normalizeLabel(
                              departmentMember.jobTitle,
                              t("not-assigned", "Not assigned"),
                            )}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.roleBadge} ${getRoleClass(demoMember.role)}`}
                          >
                            {normalizeLabel(demoMember.role, t("member"))}
                          </span>
                        </td>
                        <td className={styles.dateCell}>
                          {formatDate(departmentMember.assignedAt)}
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
                  defaultValue: "Showing {{count}} members",
                })}
              </span>
              {meta?.hasNextPage === false && (
                <span className={styles.allLoaded}>
                  {t("all-members-loaded", "All members loaded")}
                </span>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DepartmentMembersContent;
