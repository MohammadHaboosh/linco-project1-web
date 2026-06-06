import mascotImg from "../../../assets/icons/linco-logo.png";
import { sidebarStyles } from "./SidebarStyle";

const Sidebar = ({ navLinks = [], activeItem = "Home", onLogout }) => {
  return (
    <aside className={sidebarStyles.wrapper}>
      <div className={sidebarStyles.logoWrapper}>
        <div className={sidebarStyles.logoContainer}>
          <img
            src={mascotImg}
            alt="LinCo Mascot"
            className={sidebarStyles.logoImage}
          />
        </div>
      </div>

      <button className={sidebarStyles.createWorkspaceBtn}>
        <span className={sidebarStyles.createWorkspaceBtnIcon}>+</span> Create a
        Workspace
      </button>

      <nav className={sidebarStyles.navContainer}>
        {navLinks.map((link, index) => (
          <div
            key={index}
            className={
              activeItem === link.name
                ? sidebarStyles.activeLink
                : sidebarStyles.inactiveLink
            }
            onClick={link.onClick}
          >
            {link.icon}
            {link.name}
          </div>
        ))}
      </nav>

      <div className={sidebarStyles.logoutWrapper}>
        <div onClick={onLogout} className={sidebarStyles.logoutButton}>
          <svg
            className={sidebarStyles.logoutIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log Out
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
