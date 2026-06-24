import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";

import HomePage from "../features/Dashboard/HomePage/components/home_page/HomePage";
import PendingInvitationsPage from "../features/Dashboard/PendingInvitationsPage/components/pending_invitations/PendingInvitations";
import JoinedRoomsPage from "../features/Dashboard/JoinedRoomPage/components/joined_rooms/JoinedRooms";
import SignupPage from "../pages/SignupPage.jsx";
import DemoPage from "../pages/HomeDemoPage";
import VerifyEmailPage from "../pages/VerifyEmailPage.jsx";
import VerifyAccount from "../pages/VerifyAccountPage.jsx";
import SinginPage from "../pages/SigninPage.jsx";
import CoursesPage from "../pages/CoursesPage";
import LearningPathPage from "../pages/LearningPathPage";
import DepartmentPage from "../pages/DepartmentPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import VerifyEmail from "../features/User/components/Verify/VerifyEmail.jsx";
import VerifyAccountPage from "../pages/VerifyAccountPage.jsx";

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },
  {
    path: PATHS.LANDING,
    element: <LandingPage />,
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
    path: PATHS.CHECK_EMAIL,
    element: <VerifyEmailPage />,
  },
  {
    path: PATHS.VERIFY_EMAIL,
    element: <VerifyAccountPage />,
  },
  // {
  //   path: PATHS.VERIFIED_SUCCESSFULLY,
  //   element: <VerifiedSuccessfullyPage />,
  // },
  {
    path: PATHS.SIGNIN,
    element: <SinginPage />,
  },
  {
    path: PATHS.COURSES,
    element: <CoursesPage />,
  },
  {
    path: PATHS.LEARNING_PATH,
    element: <LearningPathPage />,
  },
  // {
  //   path: PATHS.DEPARTMENTS,
  //   element: <HomeDemoPage />,
  // },
  {
    path: PATHS.DEPARTMENT_DETAILS,
    element: <DepartmentPage />,
  },
  {
    path: "*",
    element: (
      <div className="text-center p-20 text-white text-2xl font-serif">
        404 - Page Not Found
      </div>
    ),
  },
]);
