import HomePage from "../features/Dashboard/HomePage/components/home_page/HomePage.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";

const homePage = () => {
  return (
    <DashboardLayout>
      <>
        <HomePage />
      </>
    </DashboardLayout>
  );
};

export default homePage;
