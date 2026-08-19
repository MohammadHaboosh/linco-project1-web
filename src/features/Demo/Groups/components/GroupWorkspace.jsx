import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoWarningOutline } from "react-icons/io5";
import styles from "./GroupWorkspace.module.css";
import { useFetchGroups } from "../hooks/useFetchGroups";
import { useUser } from "../../../../hooks/useUser";
import { memberApi } from "../../DemoMembers/api/memberApi";
import { useDeleteDepartment } from "../../HomeDemoPage/hooks/useDeleteDepartment";
import GroupSidebar from "./GroupSidebar";
import WorkspaceToolbar from "./WorkspaceToolbar";
import WorkspaceStage from "./WorkspaceStage";
import EmptyWorkspace from "./EmptyWorkspace";
import CreateGroupModal from "./CreateGroupModal";
import GroupMembersPanel from "./GroupMembersPanel";

const MOBILE_WORKSPACE_QUERY = "(max-width: 900px)";

const isMobileWorkspace = () =>
  typeof window !== "undefined" &&
  window.matchMedia(MOBILE_WORKSPACE_QUERY).matches;

const GroupWorkspace = () => {
  const { t } = useTranslation();
  const { demoId, groupId } = useParams();
  const navigate = useNavigate();

  const { profile } = useUser();
  const userId = profile?.id;
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const { groups, isLoading, error, refetch } = useFetchGroups(demoId);

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);
  const [hasOpenedDrawio, setHasOpenedDrawio] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileWorkspace);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => !isMobileWorkspace() || !groupId,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [shareTrigger, setShareTrigger] = useState(0);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { deleteDepartment, isDeleting: isDeletingGroup } = useDeleteDepartment(
    demoId,
    () => {
      navigate(`/demos/${demoId}/groups`);
    },
  );

  const confirmDeleteGroup = async () => {
    if (activeGroup) {
      await deleteDepartment(activeGroup.id);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    if (!demoId || !userId) return;

    let isMounted = true;

    const fetchCurrentMemberId = async () => {
      try {
        const response = await memberApi.getMembers(demoId);

        if (isMounted && response?.data) {
          const myMemberRecord = response.data.find(
            (member) => member.user?.id === userId,
          );

          if (myMemberRecord) {
            setCurrentMemberId(myMemberRecord.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch demo members for ID matching:", error);
      }
    };

    fetchCurrentMemberId();

    return () => {
      isMounted = false;
    };
  }, [demoId, userId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_WORKSPACE_QUERY);

    const handleViewportChange = (event) => {
      setIsMobile(event.matches);
      setIsSidebarOpen(!event.matches || !groupId);
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, [groupId]);

  useEffect(() => {
    if (!isMobile || !isSidebarOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, isSidebarOpen]);

  const activeGroup = groups.find((g) => g.id === groupId);

  const isManager = activeGroup?.managerId === currentMemberId;
  const visibleLayout =
    isMobile && layout === "split"
      ? activeTool
        ? "tool-only"
        : "chat-only"
      : layout;

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (tool === "drawio") setHasOpenedDrawio(true);
    if (visibleLayout === "chat-only" || visibleLayout === "members") {
      setLayout(isMobile ? "tool-only" : "split");
    }
  };

  const handleLayoutChange = (newLayout) => {
    if ((newLayout === "split" || newLayout === "tool-only") && !activeTool) {
      setActiveTool("photopea");
    }
    setLayout(newLayout);
  };

  const handleShareToChat = () => {
    setShareTrigger((prev) => prev + 1);
    if (isMobile) {
      setLayout("chat-only");
    } else if (visibleLayout === "tool-only") {
      setLayout("split");
    }
  };

  return (
    <div className={styles.appContainer}>
      <GroupSidebar
        demoId={demoId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        groups={groups}
        activeGroupId={activeGroup?.id}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onGroupSelect={() => {
          if (isMobile) setIsSidebarOpen(false);
        }}
      />

      {isSidebarOpen && (
        <button
          type="button"
          className={styles.sidebarBackdrop}
          onClick={() => setIsSidebarOpen(false)}
          aria-label={t("close-workspaces", "Close workspaces")}
          tabIndex={-1}
        />
      )}

      <main className={styles.mainWorkspace}>
        {isLoading ? (
          <div className={styles.workspaceStatus} role="status">
            <span className={styles.workspaceLoader} aria-hidden="true" />
            <p>{t("loading-groups", "Loading groups...")}</p>
          </div>
        ) : error ? (
          <div className={styles.workspaceStatus} role="alert">
            <h2>{t("groups-load-failed", "Couldn't load groups")}</h2>
            <p>{error}</p>
            <button type="button" onClick={refetch}>
              {t("try-again", "Try again")}
            </button>
          </div>
        ) : activeGroup ? (
          <>
            <WorkspaceToolbar
              activeGroup={activeGroup}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              activeTool={activeTool}
              onToolSelect={handleToolSelect}
              layout={visibleLayout}
              onLayoutChange={handleLayoutChange}
              onShareToChat={handleShareToChat}
              isMobile={isMobile}
              isManager={isManager}
              onDeleteClick={() => setShowDeleteConfirm(true)} // 💡 وظيفة زر الحذف
            />

            {visibleLayout === "members" ? (
              <GroupMembersPanel
                demoId={demoId}
                groupId={activeGroup.id}
                isManager={isManager}
                currentUserId={userId}
              />
            ) : (
              <WorkspaceStage
                layout={visibleLayout}
                activeTool={activeTool}
                triggerShareTool={shareTrigger}
                workspaceKey={`${demoId}:${groupId}`}
                drawioFileName={`${activeGroup.name || "diagram"}.drawio`}
                hasOpenedDrawio={hasOpenedDrawio}
              />
            )}
          </>
        ) : (
          <EmptyWorkspace
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
      </main>

      {isCreateModalOpen && (
        <CreateGroupModal
          demoId={demoId}
          currentUserId={currentMemberId}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {showDeleteConfirm && (
        <div
          className={styles.modalOverlay}
          onClick={() => !isDeletingGroup && setShowDeleteConfirm(false)}
        >
          <div
            className={styles.confirmModal}
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalIcon} aria-hidden="true">
              <IoWarningOutline />
            </div>
            <h3>{t("delete-group-confirm-title", "Delete Group?")}</h3>
            <p>
              {t(
                "delete-group-confirm-desc",
                "Are you sure you want to delete this group? This action cannot be undone.",
              )}
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeletingGroup}
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                type="button"
                className={styles.confirmDeleteBtn}
                onClick={confirmDeleteGroup}
                disabled={isDeletingGroup}
              >
                {isDeletingGroup
                  ? t("deleting", "Deleting...")
                  : t("delete", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupWorkspace;
