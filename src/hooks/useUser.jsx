import { useSelector } from "react-redux";

export const useUser = () => {
  const { profile, isAuthenticated } = useSelector((state) => state.user);

  return { profile, isAuthenticated };
};
