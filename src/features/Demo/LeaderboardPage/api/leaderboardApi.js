const simulateNetworkDelay = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const leaderboardApi = {
  getLeaderboard: async (demoId, timeframe = "weekly") => {
    // await simulateNetworkDelay();

    return [
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
    ];
  },
};
