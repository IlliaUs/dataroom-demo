import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { DataroomListPage } from "@/pages/DataroomListPage";
import { DataroomPage } from "@/pages/DataroomPage";
import { isAuthenticated } from "@/lib/auth";
import { useLocation } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const location = useLocation();
  const authed = isAuthenticated();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export const AppRouter: React.FC = () => {
  const authed = isAuthenticated();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/datarooms"
        element={
          <ProtectedRoute>
            <DataroomListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dataroom/:id"
        element={
          <ProtectedRoute>
            <DataroomPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to={authed ? "/datarooms" : "/login"} replace />}
      />

      <Route
        path="*"
        element={<Navigate to={authed ? "/datarooms" : "/login"} replace />}
      />
    </Routes>
  );
};
