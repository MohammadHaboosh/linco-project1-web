import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";

const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const { demoId } = useParams();
  const [demoData, setDemoData] = useState(null);
  const [actualRole, setActualRole] = useState("member");
  const [currentRoleView, setCurrentRoleView] = useState("member");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!demoId) return;

    const loadDemoData = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/demos/${demoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            "x-demo-id": demoId,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const demos = Array.isArray(data.data) ? data.data : [data.data];
        const activeDemo = demos.find(
          (demo) => String(demo?.id) === String(demoId),
        );

        if (!activeDemo) {
          throw new Error("The requested Demo was not found in the response.");
        }

        setDemoData(activeDemo);
        const role = activeDemo.isOwner ? "owner" : "member";

        setActualRole(role);
        setCurrentRoleView(role);
      } catch (error) {
        console.error("Failed to load demo", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [demoId]);

  const setRoleView = (role) => {
    if (actualRole === "owner") {
      setCurrentRoleView(role);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        demoId,
        demoData,
        role: actualRole,
        currentRoleView,
        setRoleView,
        isLoading,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDemo = () => useContext(DemoContext);
