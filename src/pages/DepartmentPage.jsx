import Sidebar from "../components/layouts/SideBar/Sidebar";
import Header from "../components/layouts/Header/global_header/Header";
import SubHeader from "../components/layouts/Header/sub_header/SubHeader";
import DepartmentContent from "../features/Demo/DepartmentPage/components/DepartmentContent/DepartmentContent";

const DepartmentPage = () => {
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
          role="trainee"
          companyName="TechCorp"
          roomName="Front-End Dept"
          showDeptSwitcher={true}
        />
        <SubHeader role="trainee" />
        <DepartmentContent />
      </div>
    </div>
  );
};

export default DepartmentPage;
