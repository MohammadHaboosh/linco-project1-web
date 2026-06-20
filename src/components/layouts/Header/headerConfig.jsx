import {
  IoLinkOutline,
  IoMapOutline,
  IoListOutline,
  IoPersonOutline,
  IoChatbubblesOutline,
} from "react-icons/io5";
import { PATHS } from "../../../routes/paths";

export const HEADER_CONFIG = {
  global: {
    navLinks: [
      { name: "Home", path: PATHS.HOME },
      { name: "Pending Invitations", path: PATHS.PENDING_INVITATIONS },
      { name: "Joined Rooms", path: PATHS.JOINED_ROOMS },
      { name: "My Own Rooms", path: PATHS.OWN_ROOMS },
      { name: "My Profile", path: PATHS.PROFILE },
    ],
  },
  trainee: {
    subNavLinks: [
      {
        name: "Learning Path",
        icon: <IoLinkOutline />,
        path: PATHS.LEARNING_PATH,
      },
      { name: "Courses", icon: <IoLinkOutline />, path: PATHS.COURSES },
      { name: "Road Map", icon: <IoMapOutline />, path: PATHS.ROAD_MAP },
      {
        name: "Weekly Tasks",
        icon: <IoListOutline />,
        path: PATHS.WEEKLY_TASKS,
      },
      {
        name: "Leaderboard",
        icon: <IoPersonOutline />,
        path: PATHS.LEADERBOARD,
      },
      {
        name: "Group Workspace",
        icon: <IoLinkOutline />,
        path: PATHS.GROUP_WORKSPACE,
      },
      {
        name: "Group Chat",
        icon: <IoChatbubblesOutline />,
        path: PATHS.GROUP_CHAT,
      },
    ],
  },
  "section manger": {
    subNavLinks: [],
  },
  owner: {
    subNavLinks: [],
  },
};
