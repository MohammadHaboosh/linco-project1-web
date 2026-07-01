import { useState, useEffect } from "react";
import { leaderboardApi } from "../api/leaderboardApi";

export const useLeaderboard = (demoId) => {
  const [leaderboard, setLeaderboard] = useState([
    {
      id: 1,
      name: "Ahmad Yasin",
      role: "Senior Developer",
      xp: 12500,
      tasks: 45,
      rankChange: 1,
      avatar: "/images/avatar1.jpg",
    },
    {
      id: 2,
      name: "Sarah Khaled",
      role: "UI/UX Designer",
      xp: 11200,
      tasks: 40,
      rankChange: -1,
      avatar: "/images/avatar2.jpg",
    },
    {
      id: 3,
      name: "Omar Nabil",
      role: "Backend Engineer",
      xp: 10800,
      tasks: 38,
      rankChange: 2,
      avatar: "/images/avatar3.jpg",
    },
    {
      id: 4,
      name: "Lina Majed",
      role: "Frontend Intern",
      xp: 9500,
      tasks: 32,
      rankChange: 0,
      avatar: "/images/avatar4.jpg",
    },
    {
      id: 5,
      name: "Tarek Ziad",
      role: "DevOps Engineer",
      xp: 8900,
      tasks: 29,
      rankChange: -2,
      avatar: "/images/avatar5.jpg",
    },
    {
      id: 6,
      name: "Nour Samer",
      role: "QA Tester",
      xp: 8400,
      tasks: 27,
      rankChange: 1,
      avatar: "/images/avatar6.jpg",
    },
  ]);
  const [timeframe, setTimeframe] = useState("weekly");

  const [isLoading, setIsLoading] = useState(!!demoId);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     let isMounted = true;
  //     if (!demoId) return;

  //     const loadData = async () => {
  //       try {
  //         const data = await leaderboardApi.getLeaderboard(demoId, timeframe);
  //         setLeaderboard(data);
  //         if (isMounted) {
  //           setLeaderboard(data);
  //           setError(null);
  //         }
  //       } catch (err) {
  //         if (isMounted) setError("Failed to load leaderboard data.");
  //       } finally {
  //         if (isMounted) setIsLoading(false);
  //       }
  //     };

  //     loadData();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [demoId, timeframe]);

  const changeTimeframe = (newTimeframe) => {
    if (newTimeframe === timeframe) return;
    setIsLoading(true);
    setTimeframe(newTimeframe);
  };

  return {
    leaderboard,
    timeframe,
    setTimeframe: changeTimeframe,
    isLoading,
    error,
  };
};
