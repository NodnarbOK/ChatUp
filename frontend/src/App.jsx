import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const App = () => {
  // Gets global useStates from useAuthStore
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  console.log({ onlineUsers }); 
  // Run checkAuth every time app mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);  // Good practice, just in case checkAuth somehow changes when different references change

  console.log({ authUser });

  if (isCheckingAuth && !authUser) {
    return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div> 
  )}

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} /> {/* If not an authUser, nav to login */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" /> } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
