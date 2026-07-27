import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../hooks/useDemo";
import { PATHS } from "../../routes/paths";

const DemoRedirector = () => {
  const { role, isLoading } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (role === "owner") {
      navigate(PATHS.OWNER_HOME, { replace: true });
    } else {
      navigate(PATHS.DEPARTMENTS, { replace: true });
    }
  }, [role, isLoading, navigate]);

  return null;
};

export default DemoRedirector;
