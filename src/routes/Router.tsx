import LoginLayout from "@/layout/LoginLayout";
import UserDashboardLayout from "@/layout/user dashboard/UserDashboardLayout";
import NotFound from "@/pages/NotFound";
import ClosedVotes from "@/pages/user dashboard/ClosedVotes";
import LiveVotes from "@/pages/user dashboard/LiveVotes";
import Positions from "@/pages/user dashboard/Positions";
import ForgotPassword from "@/shared/Login&Registration/ForgotPassword";
import Login from "@/shared/Login&Registration/Login";
import Registration from "@/shared/Login&Registration/Registration";
import ResetPassword from "@/shared/Login&Registration/ResetPassword";
import { createBrowserRouter } from "react-router-dom";
import Profile from "@/pages/user dashboard/Profile";
import PrivateRoute from "./PrivateRoute";
import VotingHistory from "@/pages/user dashboard/VotingHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, // Default child route for "/"
        element: <Login />,
      },
      {
        path: "registration",
        element: <Registration />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <UserDashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true, // Default child route for "/dashboard"
        element: <Profile />,
      },
      {
        path: "live-votes",
        element: <LiveVotes />,
      },
      {
        path: "closed-votes",
        element: <ClosedVotes />,
      },
      {
        path: "positions",
        element: <Positions />,
      },
      {
        path: "voting-history",
        element: <VotingHistory/>,
      },
      // Add more dashboard-specific routes here if needed
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
