import { useState } from "react";
import ToolCard from "../ToolCard/ToolCard";
import ToolViewer from "../ToolViewer/ToolViewer";
import styles from "./ToolsContent.module.css";
import { IoExtensionPuzzleOutline } from "react-icons/io5";

const TOOLS_DATA = [
  {
    id: "drawio",
    name: "Draw.io",
    description:
      "Create professional flowcharts, process diagrams, and architectural layouts directly in your workspace.",
    url: "https://embed.diagrams.net/?embed=1&ui=min",
    icon: "https://cdn.jsdelivr.net/gh/jgraph/drawio/src/main/webapp/images/logo.png",
    tags: ["Diagrams", "Architecture", "UML"],
  },
  {
    id: "photopea",
    name: "Photopea",
    description:
      "Advanced image editor supporting PSD, XCF, Sketch, XD and CDR formats. Photoshop alternative.",
    url: "https://www.photopea.com/",
    icon: "https://www.photopea.com/promo/icon512.png",
    tags: ["Design", "Image Editing", "UI/UX"],
  },
];

const ToolsContent = () => {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleOpenTool = (tool) => {
    setSelectedTool(tool);
  };

  const handleCloseTool = () => {
    setSelectedTool(null);
  };

  return (
    <div className={styles.contentArea}>
      <div className={styles.headerArea}>
        <div className={styles.headerIconWrapper}>
          <IoExtensionPuzzleOutline className={styles.headerIcon} />
        </div>
        <div>
          <span className={styles.subHeading}>INTEGRATIONS</span>
          <h1 className={styles.mainHeading}>Workspace Tools</h1>
          <p className={styles.description}>
            Access powerful external tools seamlessly without leaving your LinCo
            environment.
          </p>
        </div>
      </div>

      <div className={styles.toolsGrid}>
        {TOOLS_DATA.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onOpen={() => handleOpenTool(tool)}
          />
        ))}
      </div>

      {selectedTool && (
        <ToolViewer tool={selectedTool} onClose={handleCloseTool} />
      )}
    </div>
  );
};

export default ToolsContent;
