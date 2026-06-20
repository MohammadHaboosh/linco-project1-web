import { createBrowserRouter } from "react-router-dom";
import HomePage from "../features/HomePage/components/home_page/HomePage";
import PendingInvitationsPage from "../features/PendingInvitationsPage/components/pending_invitations/PendingInvitations";
import JoinedRoomsPage from "../features/JoinedRoomPage/components/joined_rooms/JoinedRooms";
import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },
  {
    path: PATHS.PENDING_INVITATIONS,
    element: <PendingInvitationsPage />,
  },
  {
    path: PATHS.JOINED_ROOMS,
    element: <JoinedRoomsPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center p-20 text-white text-2xl font-serif">
        الصفحة غير موجودة 404
      </div>
    ),
  },
]);
