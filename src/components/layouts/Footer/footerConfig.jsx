import { PATHS } from "../../../routes/paths";

export const FOOTER_CONFIG = {
  dashboard: [
    {
      name: "Pending Invitations",
      translationKey: "pending-invitations",
      path: PATHS.PENDING_INVITATIONS,
    },
    {
      name: "Joined Demos",
      translationKey: "joined-workspaces",
      path: PATHS.JOINED_ROOMS,
    },
    {
      name: "My Demos",
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
    { name: "Home", translationKey: "home", path: "" },
    { name: "Members", translationKey: "members", path: PATHS.MEMBERS },
    { name: "Courses", translationKey: "courses", path: PATHS.COURSES },
    { name: "Lives", translationKey: "lives", path: PATHS.LIVES },
    {
      name: "Demo Library",
      translationKey: "workspace-library",
      path: PATHS.SM_ASSETS,
    },
    {
      name: "Tools Settings",
      translationKey: "workspace-tools",
      path: PATHS.SM_TOOLS,
    },
    {
      name: "Leaderboard",
      translationKey: "company-leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      translationKey: "department-chat",
      path: PATHS.CHAT_GROUPS,
    },
    {
      name: "Road Maps",
      translationKey: "learning-roadmaps",
      path: PATHS.ROADMAPS,
    },
  ],
  department_member: [
    { name: "Home", translationKey: "home", path: "" },
    { name: "Courses", translationKey: "courses", path: PATHS.COURSES },
    {
      name: "Road Maps",
      translationKey: "learning-roadmaps",
      path: PATHS.ROADMAPS,
    },
    {
      name: "Leaderboard",
      translationKey: "company-leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      translationKey: "department-chat",
      path: PATHS.CHAT_GROUPS,
    },
    {
      name: "Demo Tools",
      translationKey: "workspace-tools",
      path: PATHS.TOOLS,
    },
  ],
  department_admin: [
    { name: "Home", translationKey: "home", path: "" },
    { name: "Members", translationKey: "members", path: PATHS.MEMBERS },
    {
      name: "Demo Library",
      translationKey: "workspace-library",
      path: PATHS.SM_ASSETS,
    },
    { name: "Courses", translationKey: "courses", path: PATHS.COURSES },
    { name: "Lives", translationKey: "lives", path: PATHS.LIVES },
    {
      name: "Tools Settings",
      translationKey: "workspace-tools",
      path: PATHS.SM_TOOLS,
    },
    {
      name: "Leaderboard",
      translationKey: "company-leaderboard",
      path: PATHS.LEADERBOARD,
    },
    {
      name: "Chat",
      translationKey: "department-chat",
      path: PATHS.CHAT_GROUPS,
    },
    {
      name: "Road Maps",
      translationKey: "learning-roadmaps",
      path: PATHS.ROADMAPS,
    },
  ],
};
