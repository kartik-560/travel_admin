import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ItinerariesList from "./pages/ItinerariesList";
import CreateItinerary from "./pages/CreateItinerary";
import EditItinerary from "./pages/EditItinerary";
import Toast from "./components/Toast";
import { useToast } from "./hooks/useToast";

const App = () => {
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/itineraries" element={<ItinerariesList />} />
              <Route path="/create" element={<CreateItinerary />} />
              <Route path="/edit/:id" element={<EditItinerary />} />
            </Routes>
          </main>
        </div>
      </div>
      
      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Router>
  );
};

export default App;