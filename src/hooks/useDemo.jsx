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
        console.log("Fetched demo data :", data);

        setDemoData(data.data);
        console.log("data.data.isOwner :", data.data[0].isOwner);
        const role = data.data.isOwner ? "owner" : "member";
        console.log("Determined role :", role);

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
