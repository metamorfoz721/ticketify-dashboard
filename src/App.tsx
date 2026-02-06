import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { ReaderPage } from "./pages/ReaderPage";
import { LoginPage } from "./pages/LoginPage";
import { TicketListPage } from "./pages/TicketListPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { ReaderProfilePage } from "./pages/ReaderProfilePage";
import { UsersPage } from "./pages/UsersPage";
import { isAuthenticated } from "./api";
import { ThemeProvider } from "./context/ThemeContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-20">{children}</div>
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-container h-20 flex justify-around items-center px-4 z-50">
        <Link
          to="/reader"
          className="flex flex-col items-center gap-1 group w-full"
        >
          <div className={`px-5 py-1 rounded-full transition-all duration-300 ${location.pathname === "/reader"
            ? "bg-secondary-container text-on-secondary-container"
            : "text-on-surface-variant group-hover:bg-surface-container-highest"
            }`}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm8 6h2v2h-2v-2zM9 11h2v2H9v-2zm4-4h2v2h-2V7zm-4 0h2v2H9V7z" />
            </svg>
          </div>
          <span className={`text-[12px] font-bold tracking-wide transition-colors ${location.pathname === "/reader" ? "text-on-surface" : "text-on-surface-variant"}`}>
            Tarayıcı
          </span>
        </Link>
        <Link
          to="/tickets"
          className="flex flex-col items-center gap-1 group w-full"
        >
          <div className={`px-5 py-1 rounded-full transition-all duration-300 ${location.pathname === "/tickets" || location.pathname.startsWith("/tickets/")
            ? "bg-secondary-container text-on-secondary-container"
            : "text-on-surface-variant group-hover:bg-surface-container-highest"
            }`}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2 0v12h12V6H6zm5 2h2v8h-2V8z" />
            </svg>
          </div>
          <span className={`text-[12px] font-bold tracking-wide transition-colors ${location.pathname === "/tickets" || location.pathname.startsWith("/tickets/") ? "text-on-surface" : "text-on-surface-variant"}`}>
            Biletler
          </span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-1 group w-full"
        >
          <div className={`px-5 py-1 rounded-full transition-all duration-300 ${location.pathname === "/profile"
            ? "bg-secondary-container text-on-secondary-container"
            : "text-on-surface-variant group-hover:bg-surface-container-highest"
            }`}>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className={`text-[12px] font-bold tracking-wide transition-colors ${location.pathname === "/profile" ? "text-on-surface" : "text-on-surface-variant"}`}>
            Profil
          </span>
        </Link>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/reader"
          element={
            <ProtectedRoute>
              <Layout>
                <ReaderPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ReaderProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/reader" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;

