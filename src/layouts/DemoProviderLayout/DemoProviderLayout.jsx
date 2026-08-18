import { Outlet } from "react-router-dom";
import { DemoProvider } from "../../hooks/useDemo.jsx";

const DemoProviderLayout = () => (
  <DemoProvider>
    <Outlet />
  </DemoProvider>
);

export default DemoProviderLayout;
