import { useState } from "react";
import ToolCard from "../ToolCard/ToolCard";
import ToolViewer from "../ToolViewer/ToolViewer";
import styles from "./ToolsContent.module.css";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const TOOLS_DATA = [
  {
    id: "drawio",
    name: "Draw.io",
    descriptionKey: "drawio-description",
    url: "https://embed.diagrams.net/?embed=1&ui=min",
    icon: "https://cdn.jsdelivr.net/gh/jgraph/drawio/src/main/webapp/images/logo.png",
    tagKeys: ["tool-tag-diagrams", "tool-tag-architecture", "tool-tag-uml"],
  },
  {
    id: "photopea",
    name: "Photopea",
    descriptionKey: "photopea-description",
    url: "https://www.photopea.com/",
    icon: "https://www.photopea.com/promo/icon512.png",
    tagKeys: ["tool-tag-design", "tool-tag-image-editing", "tool-tag-ui-ux"],
  },
];

const ToolsContent = () => {
  const { t } = useTranslation();
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
          <IoExtensionPuzzleOutline
            className={styles.headerIcon}
            aria-hidden="true"
          />
        </div>
        <div>
          <span className={styles.subHeading}>{t("integrations")}</span>
          <h1 className={styles.mainHeading}>{t("workspace-tools")}</h1>
          <p className={styles.description}>
            {t("workspace-tools-description")}
          </p>
        </div>
      </div>

      <section
        className={styles.toolsGrid}
        aria-label={t("available-workspace-tools")}
      >
        {TOOLS_DATA.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onOpen={() => handleOpenTool(tool)}
          />
        ))}
      </section>

      {selectedTool && (
        <ToolViewer tool={selectedTool} onClose={handleCloseTool} />
      )}
    </div>
  );
};

export default ToolsContent;
