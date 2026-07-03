import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DemoContext = createContext();

export const DemoProvider = ({ children }) => {
  const { demoId } = useParams();
  const [demoData, setDemoData] = useState(null);
  const [actualRole, setActualRole] = useState("trainee");
  const [currentRoleView, setCurrentRoleView] = useState("trainee");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!demoId) return;

    const loadDemoData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/demos/${demoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched demo data :", data);
        // "id": "019f0fe8-d807-73b9-a0c7-891a13776c4b",
        // "name": "Google",
        // "imagePath": "qwertyuikol",
        // "description": "nothing for now",
        // "plan": "STARTER",
        // "createdAt": "2026-06-28T20:25:45.735Z",
        // "updatedAt": "2026-06-30T18:00:20.727Z",
        // "ownerName": "Abrar Abo Auad",
        // "membersCount": 1,
        // "isOwner": false

        setDemoData(data.data);

        console.log("data.data.role :", data.data.role);
        const role = data.data.isOwner ? "owner" : data.data.role || "trainee";

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
