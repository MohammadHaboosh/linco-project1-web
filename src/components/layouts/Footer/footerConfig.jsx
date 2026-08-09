import { PATHS } from "../../../routes/paths";

export const FOOTER_CONFIG = {
  dashboard: [
    { name: "Pending Invitations", path: PATHS.PENDING_INVITATIONS },
    { name: "Joined Rooms", path: PATHS.JOINED_ROOMS },
    { name: "My Own Rooms", path: PATHS.OWN_ROOMS },
  ],
  demo_owner: [
    {
      name: "Demo Courses",
      path: PATHS.OWNER_COURSES,
    },
    {
      name: "Departments",
      path: PATHS.DEPARTMENTS,
    },
    {
      name: "Demo Members",
      path: PATHS.OWNER_MEMBERS,
    },
    {
      name: "Inquiries",
      path: PATHS.INQUIRIES,
    },
    { name: "Lives", path: PATHS.LIVES },
    {
      name: "Public Library",
      path: PATHS.OWNER_LIBRARY,
    },
  ],
  demo_member: [
    { name: "Departments", path: "" },
    {
      name: "Certificates",
      path: PATHS.CERTIFICATES,
    },
    { name: "Lives", path: PATHS.LIVES },
    {
      name: "Inquiries",
      path: PATHS.INQUIRIES,
    },
  ],
  demo_admin: [
    { name: "Departments", path: "" },
    {
      name: "Certificates",
      path: PATHS.CERTIFICATES,
    },
    { name: "Lives", path: PATHS.LIVES },
    {
      name: "Inquiries",
      path: PATHS.INQUIRIES,
    },
  ],
  department_owner: [
    { name: "Home", path: "" },
    { name: "Members", path: PATHS.MEMBERS },
    { name: "Courses", path: PATHS.COURSES },
    { name: "Lives", path: PATHS.LIVES },
    {
      name: "Demo Library",
      path: PATHS.SM_ASSETS,
    },
    {
      name: "Tools Settings",
      path: PATHS.SM_TOOLS,
    },
    {
      name: "Leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      path: PATHS.CHAT_GROUPS,
    },
    {
      name: "Learning Path",
      path: PATHS.SM_LEARNING_PATH,
    },
    { name: "Road Maps", path: PATHS.ROADMAPS },
  ],
  department_member: [
    { name: "Home", path: "" },
    {
      name: "Learning Path",
      path: PATHS.LEARNING_PATH,
    },
    { name: "Courses", path: PATHS.COURSES },
    { name: "Road Maps", path: PATHS.ROADMAPS },
    {
      name: "Leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      path: PATHS.CHAT_GROUPS,
    },
    {
      name: "Workspace Tools",
      path: PATHS.TOOLS,
    },
  ],
  department_admin: [
    { name: "Home", path: "" },
    { name: "Members", path: PATHS.MEMBERS },
    {
      name: "Demo Library",
      path: PATHS.SM_ASSETS,
    },
    { name: "Courses", path: PATHS.COURSES },
    { name: "Lives", path: PATHS.LIVES },
    {
      name: "Tools Settings",
      path: PATHS.SM_TOOLS,
    },
    {
      name: "Learning Path",
      path: PATHS.SM_LEARNING_PATH,
    },
    {
      name: "Leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      path: PATHS.CHAT_GROUPS,
    },
    { name: "Road Maps", path: PATHS.ROADMAPS },
  ],
};
