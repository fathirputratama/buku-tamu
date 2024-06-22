// src/routers/router.js
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import EventPage from "../pages/EventPage";
import ProfilePage from "../pages/ProfilePage";
import DetailEventCom from "../Component/DetailEventCom";
import TambahAttendance from "../pages/AttendancePage";
import ProtectedRoute from "../routers/utils/ProtectedRoute"; // Pastikan path ini benar
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import ListAttendance from "../Component/ListAttendanceCom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/newpass",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // Bungkus dengan ProtectedRoute
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/event",
        element: <EventPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        },
      {
        path: "/detailevent/:guid_event",
        element: <DetailEventCom />,
      },
      {
        path: "/listattendance/:guid_event",
        element: <ListAttendance />,
      },
      {
        path: "/addattendance/:guid_event",
        element: <TambahAttendance />,
      },
      {
        path: "/attendance/addattendance/:guid_event",
        element: <TambahAttendance />,
      },
    ],
  },
]);

export default router;