import { useState } from "react";

export const useRole = () => {
  const [role, setRole] = useState("owner");

  const isOwner = role === "owner" || role === "manager";
  const isTrainee = role === "trainee";

  return { role, isOwner, isTrainee, setRole };
};
