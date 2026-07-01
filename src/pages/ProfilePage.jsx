import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import Footer from "../components/layouts/Footer/Footer";
import ProfileContent from "../features/Profile/components/ProfileContent";

const ProfilePage = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-linco-navy)",
      }}
    >
      <Sidebar role="global" />

      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#f8fafc",
        }}
      >
        <Header role="global" />
        <ProfileContent />
        <Footer role="global" />
      </div>
    </div>
  );
};

export default ProfilePage;
