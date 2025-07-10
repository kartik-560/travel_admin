import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6 space-y-4">
      <h2 className="text-2xl font-bold">🧭 Travel Admin</h2>
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/itineraries" className="hover:text-yellow-400">Itineraries</Link>
        <Link to="/create" className="hover:text-yellow-400">Create New</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
