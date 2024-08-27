import LoginLayout from "@/layout/LoginLayout";
import UserDashboardLayout from "@/layout/user dashboard/UserDashboardLayout";
import NotFound from "@/pages/NotFound";
import ClosedVotes from "@/pages/user dashboard/ClosedVotes";
import LiveVotes from "@/pages/user dashboard/LiveVotes";
import Positions from "@/pages/user dashboard/Positions";
import ForgotPassword from "@/pages/Login&Registration/ForgotPassword";
import Login from "@/pages/Login&Registration/Login";
import Registration from "@/pages/Login&Registration/Registration";
import ResetPassword from "@/pages/Login&Registration/ResetPassword";
import { createBrowserRouter } from "react-router-dom";
import Profile from "@/pages/user dashboard/Profile";
import PrivateRoute from "./PrivateRoute";
import VotingHistory from "@/pages/user dashboard/VotingHistory";
import AdminLogin from "@/pages/Login&Registration/AdminLogin";
import UserManagement from "@/pages/admin dashboard/UserManagement";
import AdminLiveVotes from "@/pages/admin dashboard/AdminLiveVotes";
import VoteDetails from "@/pages/admin dashboard/VoteDetails";
import UserDetails from "@/pages/admin dashboard/UserDetails";
import CreatePosition from "@/pages/admin dashboard/CreatePosition";
import ManagePositions from "@/pages/admin dashboard/ManagePositions";
import AdminRoute from "./AdminRoute";

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
      {
        path: "admin-login",
        element: <AdminLogin />,
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
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "live-votes",
        element: (
          <PrivateRoute>
            <LiveVotes />
          </PrivateRoute>
        ),
      },
      {
        path: "closed-votes",
        element: (
          <PrivateRoute>
            <ClosedVotes />
          </PrivateRoute>
        ),
      },
      {
        path: "positions",
        element: (
          <PrivateRoute>
            <Positions />
          </PrivateRoute>
        ),
      },
      {
        path: "voting-history",
        element: (
          <PrivateRoute>
            <VotingHistory />
          </PrivateRoute>
        ),
      },
      // Add more dashboard-specific routes here if needed
    ],
  },
  {
    path: "/admin-dashboard",
    element: (
      <PrivateRoute>
        <UserDashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        ),
      },
      {
        path: "user-management/user-details/:email",
        element: (
          <AdminRoute>
            <UserDetails />
          </AdminRoute>
        ),
      },
      {
        path: "live-votes",
        element: (
          <AdminRoute>
            <AdminLiveVotes />
          </AdminRoute>
        ),
      },
      {
        path: "positions/see-details/:positionId",
        element: (
          <AdminRoute>
            <VoteDetails />
          </AdminRoute>
        ),
      },
      {
        path: "closed-votes",
        element: <ClosedVotes />,
      },
      {
        path: "positions",
        children: [
          {
            path: "create-position",
            element: (
              <AdminRoute>
                <CreatePosition />
              </AdminRoute>
            ),
          },
          {
            path: "manage-positions",
            element: (
              <AdminRoute>
                <ManagePositions />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
