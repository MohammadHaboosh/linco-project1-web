import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./GroupWorkspace.module.css";
import { useFetchGroups } from "../hooks/useFetchGroups";
import { useUser } from "../../../../hooks/useUser";
import { memberApi } from "../../DemoMembers/api/memberApi";
import GroupSidebar from "./GroupSidebar";
import WorkspaceToolbar from "./WorkspaceToolbar";
import WorkspaceStage from "./WorkspaceStage";
import EmptyWorkspace from "./EmptyWorkspace";
import CreateGroupModal from "./CreateGroupModal";
import GroupMembersPanel from "./GroupMembersPanel";

const GroupWorkspace = () => {
  const { demoId, groupId } = useParams();

  const { profile } = useUser();
  const userId = profile?.id;
  const [currentMemberId, setCurrentMemberId] = useState(null);

  const { groups, isLoading, refetch } = useFetchGroups(demoId);

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);
  const [hasOpenedDrawio, setHasOpenedDrawio] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [shareTrigger, setShareTrigger] = useState(0);

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

  const activeGroup = groups.find((g) => g.id === groupId);

  const isManager = activeGroup?.managerId === currentMemberId;

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (tool === "drawio") setHasOpenedDrawio(true);
    if (layout === "chat-only" || layout === "members") {
      setLayout("split");
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
    if (layout === "tool-only") {
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
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <main className={styles.mainWorkspace}>
        {activeGroup ? (
          <>
            <WorkspaceToolbar
              activeGroup={activeGroup}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              activeTool={activeTool}
              onToolSelect={handleToolSelect}
              layout={layout}
              onLayoutChange={handleLayoutChange}
              onShareToChat={handleShareToChat}
            />

            {layout === "members" ? (
              <GroupMembersPanel
                demoId={demoId}
                groupId={activeGroup.id}
                isManager={isManager}
              />
            ) : (
              <WorkspaceStage
                layout={layout}
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
    </div>
  );
};

export default GroupWorkspace;
