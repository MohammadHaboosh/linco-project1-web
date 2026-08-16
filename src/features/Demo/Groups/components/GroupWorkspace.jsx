import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GroupWorkspace.module.css";

import GroupSidebar from "./GroupSidebar";
import WorkspaceToolbar from "./WorkspaceToolbar";
import WorkspaceStage from "./WorkspaceStage";
import EmptyWorkspace from "./EmptyWorkspace";

const MOCK_GROUPS = [
  { id: "g1", name: "React Developers", initials: "RD" },
  { id: "g2", name: "UI/UX Masters", initials: "UI" },
  { id: "g3", name: "Backend Architecture", initials: "BA" },
];

const GroupWorkspace = () => {
  const { groupId } = useParams();

  const [layout, setLayout] = useState("chat-only");
  const [activeTool, setActiveTool] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeGroup = MOCK_GROUPS.find((g) => g.id === groupId);

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
        groups={MOCK_GROUPS}
        activeGroupId={activeGroup?.id}
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
    </div>
  );
};

export default GroupWorkspace;
