import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import DemoContent from "../features/Demo/HomeDemoPage/components/DemoContent/DemoContent";
import SubHeader from "../components/layouts/Header/sub_header/SubHeader";

const HomeDemoPage = () => {
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
          backgroundColor: "#ffffff",
        }}
      >
        <Header
          role="demo_home"
          companyName="TechCorp"
          roomName="Front-End Dept"
          showDeptSwitcher={true}
        />
        <SubHeader role="demo_home" />
        <DemoContent />
      </div>
    </div>
  );
};

export default HomeDemoPage;
