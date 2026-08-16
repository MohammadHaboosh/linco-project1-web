import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GroupWorkspace.module.css";
import { useGroups } from "../hooks/useGroups";

import GroupSidebar from "./GroupSidebar";
import WorkspaceToolbar from "./WorkspaceToolbar";
import WorkspaceStage from "./WorkspaceStage";
import EmptyWorkspace from "./EmptyWorkspace";
import CreateGroupModal from "./CreateGroupModal";

const GroupWorkspace = () => {
  const { groupId } = useParams();

  const { groups, isLoading, createGroup, isCreating } = useGroups();

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className={styles.appContainer}>
      <GroupSidebar
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
            />

            <WorkspaceStage layout={layout} activeTool={activeTool} />
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
          onClose={() => setIsCreateModalOpen(false)}
          createGroup={createGroup}
          isCreating={isCreating}
        />
      )}
    </div>
  );
};

export default GroupWorkspace;
