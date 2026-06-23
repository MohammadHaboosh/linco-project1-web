import GlobalHeader from "./GlobalHeader";
import WorkspaceHeader from "../workspace_header/WorkspaceHeader";

const Header = ({
  role = "global",
  companyName = "CompanyName",
  roomName = "Company Demo",
  showDeptSwitcher = false,
}) => {
  if (role !== "global") {
    return (
      <WorkspaceHeader
        companyName={companyName}
        roomName={roomName}
        showDeptSwitcher={showDeptSwitcher}
      />
    );
  }

  return <GlobalHeader />;
};

export default Header;
