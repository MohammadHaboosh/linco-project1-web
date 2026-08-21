import { useContext } from "react";
import { AppAlertContext } from "./appAlertContext";

export const useAppAlert = () => {
  const context = useContext(AppAlertContext);

  if (!context) {
    throw new Error("useAppAlert must be used within AppAlertProvider");
  }

  return context;
};
