import { PATHS } from "../../../routes/paths";

export const FOOTER_CONFIG = {
  dashboard: [
    {
      name: "Pending Invitations",
      translationKey: "pending-invitations",
      path: PATHS.PENDING_INVITATIONS,
    },
    {
      name: "Joined Workspaces",
      translationKey: "joined-workspaces",
      path: PATHS.JOINED_ROOMS,
    },
    {
      name: "My Workspaces",
      translationKey: "owned-workspaces",
      path: PATHS.OWN_ROOMS,
    },
  ],
  demo_owner: [
    {
      name: "Demo Courses",
      translationKey: "demo-courses",
      path: PATHS.OWNER_COURSES,
    },
    {
      name: "Departments",
      translationKey: "departments",
      path: PATHS.DEPARTMENTS,
    },
    {
      name: "Demo Members",
      translationKey: "demo-members",
      path: PATHS.OWNER_MEMBERS,
    },
    {
      name: "Inquiries",
      translationKey: "inquiries",
      path: PATHS.INQUIRIES,
    },
    { name: "Lives", translationKey: "lives", path: PATHS.LIVES },
    {
      name: "Public Library",
      translationKey: "public-library",
      path: PATHS.OWNER_LIBRARY,
    },
  ],
  demo_member: [
    { name: "Departments", translationKey: "departments", path: "" },
    {
      name: "Certificates",
      translationKey: "my-certificates",
      path: PATHS.CERTIFICATES,
    },
    { name: "Lives", translationKey: "lives", path: PATHS.LIVES },
    {
      name: "Inquiries",
      translationKey: "inquiries",
      path: PATHS.INQUIRIES,
    },
  ],
  demo_admin: [
    { name: "Departments", translationKey: "departments", path: "" },
    {
      name: "Certificates",
      translationKey: "my-certificates",
      path: PATHS.CERTIFICATES,
    },
    { name: "Lives", translationKey: "lives", path: PATHS.LIVES },
    {
      name: "Inquiries",
      translationKey: "inquiries",
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
    { name: "Road Maps", path: PATHS.ROADMAPS },
  ],
  department_member: [
    { name: "Home", path: "" },
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
