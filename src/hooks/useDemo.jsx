import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/apiFetch";

const DemoContext = createContext();

const isExpiredSubscriptionResponse = (response, payload) =>
  response.status === 403 &&
  /\bsubscription\b.*\bexpired\b/i.test(String(payload?.message || ""));

export const DemoProvider = ({ children }) => {
  const { demoId } = useParams();
  const [demoData, setDemoData] = useState(null);
  const [actualRole, setActualRole] = useState("member");
  const [currentRoleView, setCurrentRoleView] = useState("member");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!demoId) return;

    const loadDemoData = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const response = await apiFetch(`/demos/${demoId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-client-type": "web",
            "x-demo-id": demoId,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (isExpiredSubscriptionResponse(response, data)) {
            const responseDemo =
              data?.data &&
              !Array.isArray(data.data) &&
              typeof data.data === "object"
                ? data.data
                : {};

            setDemoData({
              ...responseDemo,
              id: responseDemo.id || demoId,
              subscriptionStatus: "EXPIRED",
            });
            return;
          }

          throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

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
        setDemoData(null);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [demoId, reloadVersion]);

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
        loadError,
        retryLoadDemo: () => setReloadVersion((version) => version + 1),
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDemo = () => useContext(DemoContext);
