import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Checkin from './components/Checkin';
import FlightSchedule from './components/FlightSchedule';
import GateAssignment from './components/GateAssignment';
import ResourceAllocation from './components/ResourceAllocation';
import Maintenance from './components/Maintenance';
import Notifications from './components/Notifications';
import Baggage from './components/Baggage';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AddPassenger from './components/AddPassenger';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/checkin" element={<Checkin />} />
            <Route path="/flights" element={<FlightSchedule />} />
            <Route path="/gates" element={<GateAssignment />} />
            <Route path="/resources" element={<ResourceAllocation />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/baggage" element={<Baggage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/passengers/add" element={<AddPassenger />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;