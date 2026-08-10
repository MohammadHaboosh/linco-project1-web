import { PATHS } from "../../../../routes/paths";

const MANAGER_ROLES = new Set(["owner", "admin", "sectionmanager"]);

const normalizeRole = (role) =>
  String(role || "")
    .replace(/[-_\s]/g, "")
    .toLowerCase();

export const canManageLiveStreams = (...roles) =>
  roles
    .map(normalizeRole)
    .some((candidateRole) => MANAGER_ROLES.has(candidateRole));

export const buildLiveRoomPath = ({ demoId, departmentId, streamId }) =>
  PATHS.LIVE_ROOM.replace(":demoId", encodeURIComponent(demoId))
    .replace(":departmentId", encodeURIComponent(departmentId))
    .replace(":streamId", encodeURIComponent(streamId));

export const buildLiveStreamsPath = ({ demoId, departmentId }) =>
  PATHS.DEMO_SECTION.replace(":demoId", encodeURIComponent(demoId))
    .replace(":departmentId", encodeURIComponent(departmentId))
    .concat(`/${PATHS.LIVES}`);
