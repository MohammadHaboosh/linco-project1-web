import { createBrowserRouter } from "react-router-dom";
import HomePage from "../features/HomePage/components/HomePage";
import PendingInvitationsPage from "../features/PendingInvitationsPage/components/PendingInvitations";
import JoinedRoomsPage from "../features/JoinedRoomPage/components/JoinedRooms";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/pending-invitations",
    element: <PendingInvitationsPage />,
  },
  {
    path: "/joined-rooms",
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
