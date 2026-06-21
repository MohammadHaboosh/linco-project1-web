import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";

import HomePage from "../features/Dashboard/HomePage/components/home_page/HomePage";
import PendingInvitationsPage from "../features/Dashboard/PendingInvitationsPage/components/pending_invitations/PendingInvitations";
import JoinedRoomsPage from "../features/Dashboard/JoinedRoomPage/components/joined_rooms/JoinedRooms";
import SignupPage from "../pages/SignupPage.jsx";
import DemoPage from "../pages/HomeDemoPage";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import SinginPage from "../pages/SigninPage.jsx";

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
    path: PATHS.DEMO,
    element: <DemoPage />,
  },
  {
    path: PATHS.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: PATHS.VERIFY_EMAIL,
    element: <VerifyEmailPage />,
  },
  {
    path: PATHS.SIGNIN,
    element: <SinginPage />,
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
