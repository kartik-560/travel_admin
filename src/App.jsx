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
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import "./index.css";

const AppLayout = ({ sidebarOpen, toggleSidebar, closeSidebar }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Only show sidebar/navbar if NOT on login page */}
      {!isLoginPage && <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />}

      <div className="main-content">
        {!isLoginPage && <Navbar toggleSidebar={toggleSidebar} />}

        <main className="page-content">
          <Routes>
            {/* public route */}
            

            {/* protected routes */}
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
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        </Routes>
      <AppLayout
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />
    </Router>
  );
};

export default App;
