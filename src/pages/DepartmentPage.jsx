import Header from "../components/layouts/Header/global_header/Header";
import SubHeader from "../components/layouts/Header/sub_header/SubHeader";
import Footer from "../components/layouts/Footer/Footer";
import DepartmentContent from "../features/Demo/DepartmentPage/components/DepartmentContent/DepartmentContent";

const DepartmentPage = () => {
  const currentRole = "trainee";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-linco-navy)",
      }}
    >
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Header
          role="trainee"
          companyName="TechCorp"
          roomName="Front-End Dept"
          showDeptSwitcher={true}
        />

        <SubHeader role={currentRole} />

        <DepartmentContent />

        <Footer role="trainee" />
      </div>
    </div>
  );
};

export default DepartmentPage;
