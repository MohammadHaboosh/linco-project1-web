import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GroupWorkspace.module.css";
import { useFetchGroups } from "../hooks/useFetchGroups";

import GroupSidebar from "./GroupSidebar";
import WorkspaceToolbar from "./WorkspaceToolbar";
import WorkspaceStage from "./WorkspaceStage";
import EmptyWorkspace from "./EmptyWorkspace";
import CreateGroupModal from "./CreateGroupModal";

const GroupWorkspace = () => {
  const { demoId, groupId } = useParams();

  const { groups, isLoading, refetch } = useFetchGroups(demoId);

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [shareTrigger, setShareTrigger] = useState(0);

  const activeGroup = groups.find((g) => g.id === groupId);

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
    if (layout === "chat-only") {
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

            <WorkspaceStage
              layout={layout}
              activeTool={activeTool}
              triggerShareTool={shareTrigger}
            />
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
