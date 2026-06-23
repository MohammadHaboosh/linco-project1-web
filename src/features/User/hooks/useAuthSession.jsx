import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { fetchCurrentUser } from "../api/userApi";

export const useAuthSession = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetchCurrentUser();
        const userData = response?.data?.user;
        if (userData) {
          dispatch(setUser(userData));
        }
      } catch (error) {
        // Silently fail if they are just a guest
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, [dispatch]);

  return { isInitializing };
};
