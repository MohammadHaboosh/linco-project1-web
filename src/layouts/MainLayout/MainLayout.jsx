import { Outlet } from "react-router-dom";
import mascotImg from "../../assets/icons/linco-logo.png";
import Sidebar from "../../components/layouts/SideBar/Sidebar";
import BrandLogo from "../../components/layouts/BrandLogo/BrandLogo";
import Footer from "../../components/layouts/Footer/Footer";
import { mainLayoutStyles } from "./MainLayoutStyle";

const sidebarLinks = [
  {
    name: "Home",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "pending Invitations",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    name: "Joined Rooms",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    name: "My Profile",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

const MainLayout = () => {
  return (
    <div className={mainLayoutStyles.wrapper}>
      <div className={mainLayoutStyles.sidebarContainer}>
        <Sidebar
          mascotImg={mascotImg}
          navLinks={sidebarLinks}
          activeItem="Home"
          onLogout={() => console.log("User logged out!")}
        />
      </div>

      <div className={mainLayoutStyles.wireContainer}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={mainLayoutStyles.wireItem}>
            <div className={mainLayoutStyles.wireBody} />
            <div className={mainLayoutStyles.wireHole} />
          </div>
        ))}
      </div>

      <div className={mainLayoutStyles.contentWrapper}>
        <div className={mainLayoutStyles.headerContainer}>
          <BrandLogo />
        </div>

        <div className={mainLayoutStyles.notebookPaper}>
          <main className={mainLayoutStyles.mainArea}>
            <div className={mainLayoutStyles.outletWrapper}>
              <Outlet />
            </div>

            <Footer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
