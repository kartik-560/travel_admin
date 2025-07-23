// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import ItinerariesList from "./pages/ItinerariesList";
// import CreateItinerary from "./pages/CreateItinerary";
// import EditItinerary from "./pages/EditItinerary";

// const App = () => {
//   return (
//     <Router>
//       <div className="app-container">
//         <Sidebar />
//         <div className="main-content">
//           <Navbar />
//           <main className="page-content">
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/itineraries" element={<ItinerariesList />} />
//               <Route path="/create" element={<CreateItinerary />} />
//               <Route path="/itineraries/edit/:id" element={<EditItinerary />} />

//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ItinerariesList from "./pages/ItinerariesList";
import CreateItinerary from "./pages/CreateItinerary";
import EditItinerary from "./pages/EditItinerary";
import "./index.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // start closed for mobile

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <div className="main-content">
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/itineraries" element={<ItinerariesList />} />
              <Route path="/itineraries/create" element={<CreateItinerary />} />
              <Route path="/itineraries/edit/:id" element={<EditItinerary />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
