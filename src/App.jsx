import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ItinerariesList from "./pages/ItinerariesList";
import CreateItinerary from "./pages/CreateItinerary";
import EditItinerary from "./pages/EditItinerary";
import PhotoGallary from "./pages/PhotoGallary";
import AdminPhotos from "./pages/AdminPhotos";
import EditPhotoGallery from "./pages/EditPhotoGallery";
import UserImpressions from "./pages/UserImpressions";
import ManageCategories from "./pages/ManageCategories";
import ManageTestimonials from "./pages/ManageTestimonials";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-7xl w-full mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/itineraries"
              element={
                <RequireAuth>
                  <ItinerariesList />
                </RequireAuth>
              }
            />
            <Route
              path="/itineraries/create"
              element={
                <RequireAuth>
                  <CreateItinerary />
                </RequireAuth>
              }
            />
            <Route
              path="/itineraries/edit/:id"
              element={
                <RequireAuth>
                  <EditItinerary />
                </RequireAuth>
              }
            />
            <Route
              path="/image/upload"
              element={
                <RequireAuth>
                  <PhotoGallary />
                </RequireAuth>
              }
            />
            <Route
              path="/adminPhotos"
              element={
                <RequireAuth>
                  <AdminPhotos />
                </RequireAuth>
              }
            />
            <Route
              path="/photo/edit/:id"
              element={
                <RequireAuth>
                  <EditPhotoGallery />
                </RequireAuth>
              }
            />
            <Route
              path="/impressions"
              element={
                <RequireAuth>
                  <UserImpressions />
                </RequireAuth>
              }
            />
            <Route
              path="/categories"
              element={
                <RequireAuth>
                  <ManageCategories />
                </RequireAuth>
              }
            />
            <Route
              path="/testimonials"
              element={
                <RequireAuth>
                  <ManageTestimonials />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
