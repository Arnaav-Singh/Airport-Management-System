import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlane, FaTools, FaCheckCircle, FaTimesCircle, FaUser, FaDoorOpen, FaWrench, FaBell, FaSuitcase, FaSpinner, FaPlus, FaUnlock } from 'react-icons/fa';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flights');
  const [loading, setLoading] = useState({});
  const [status, setStatus] = useState({ show: false, success: false, message: '', formType: '' });

  // Form states
  const [flightForm, setFlightForm] = useState({
    flight_code: '', airline: '', departure_airport: '', arrival_airport: '', departure_time: '', arrival_time: '', status: 'Scheduled'
  });
  const [resourceAddForm, setResourceAddForm] = useState({ resource_type: 'Staff', resource_name: '', status: 'Available' });
  const [resourceAssignForm, setResourceAssignForm] = useState({ resource_id: '', flight_id: '' });
  const [resourceFreeForm, setResourceFreeForm] = useState({ resource_id: '' });
  const [checkinForm, setCheckinForm] = useState({ passenger_id: '', flight_id: '', checkin_type: 'Kiosk', baggage_count: 0 });
  const [gateForm, setGateForm] = useState({ flight_id: '', gate_id: '' });
  const [maintenanceForm, setMaintenanceForm] = useState({ flight_id: '', maintenance_type: '', scheduled_date: '' });
  const [notificationForm, setNotificationForm] = useState({ flight_id: '', passenger_id: '', message: '', type: 'Info' });
  const [baggageForm, setBaggageForm] = useState({ passenger_id: '', flight_id: '', tag_number: '', status: 'Checked' });

  // Data states
  const [flights, setFlights] = useState([]);
  const [resources, setResources] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [gates, setGates] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [baggage, setBaggage] = useState([]);

  // Check authentication
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        const [
          flightsRes, resourcesRes, checkinsRes, passengersRes, gatesRes, maintenanceRes, notificationsRes, baggageRes
        ] = await Promise.all([
          axios.get('http://localhost:3001/api/flights'),
          axios.get('http://localhost:3001/api/resources'),
          axios.get('http://localhost:3001/api/checkins'),
          axios.get('http://localhost:3001/api/passengers'),
          axios.get('http://localhost:3001/api/gates'),
          axios.get('http://localhost:3001/api/maintenance'),
          axios.get('http://localhost:3001/api/notifications'),
          axios.get('http://localhost:3001/api/baggage')
        ]);
        setFlights(flightsRes.data);
        setResources(resourcesRes.data);
        setCheckins(checkinsRes.data);
        setPassengers(passengersRes.data);
        setGates(gatesRes.data);
        setMaintenance(maintenanceRes.data);
        setNotifications(notificationsRes.data);
        setBaggage(baggageRes.data);
      } catch (err) {
        setStatus({ show: true, success: false, message: 'Error fetching data', formType: 'fetch' });
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleFlightAdd = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, flightAdd: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/flights', flightForm);
      setStatus({ show: true, success: true, message: 'Flight added!', formType: 'flightAdd' });
      setFlightForm({
        flight_code: '', airline: '', departure_airport: '', arrival_airport: '', departure_time: '', arrival_time: '', status: 'Scheduled'
      });
      const res = await axios.get('http://localhost:3001/api/flights');
      setFlights(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error adding flight', formType: 'flightAdd' });
    }
    setLoading(prev => ({ ...prev, flightAdd: false }));
  };

  const handleFlightDelete = async (flight_id) => {
    setLoading(prev => ({ ...prev, flightDelete: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.delete(`http://localhost:3001/api/flights/${flight_id}`);
      setStatus({ show: true, success: true, message: 'Flight deleted!', formType: 'flightDelete' });
      setFlights(flights.filter(f => f.flight_id !== flight_id));
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error deleting flight', formType: 'flightDelete' });
    }
    setLoading(prev => ({ ...prev, flightDelete: false }));
  };

  const handleResourceAdd = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, resourceAdd: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/resources', resourceAddForm);
      setStatus({ show: true, success: true, message: 'Resource added!', formType: 'resourceAdd' });
      setResourceAddForm({ resource_type: 'Staff', resource_name: '', status: 'Available' });
      const res = await axios.get('http://localhost:3001/api/resources');
      setResources(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error adding resource', formType: 'resourceAdd' });
    }
    setLoading(prev => ({ ...prev, resourceAdd: false }));
  };

  const handleResourceAssign = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, resourceAssign: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/resources/assign', resourceAssignForm);
      setStatus({ show: true, success: true, message: 'Resource assigned!', formType: 'resourceAssign' });
      setResourceAssignForm({ resource_id: '', flight_id: '' });
      const res = await axios.get('http://localhost:3001/api/resources');
      setResources(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error assigning resource', formType: 'resourceAssign' });
    }
    setLoading(prev => ({ ...prev, resourceAssign: false }));
  };

  const handleResourceFree = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, resourceFree: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/resources/free', resourceFreeForm);
      setStatus({ show: true, success: true, message: 'Resource freed!', formType: 'resourceFree' });
      setResourceFreeForm({ resource_id: '' });
      const res = await axios.get('http://localhost:3001/api/resources');
      setResources(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error freeing resource', formType: 'resourceFree' });
    }
    setLoading(prev => ({ ...prev, resourceFree: false }));
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, checkin: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/checkin', checkinForm);
      setStatus({ show: true, success: true, message: 'Check-in successful!', formType: 'checkin' });
      setCheckinForm({ passenger_id: '', flight_id: '', checkin_type: 'Kiosk', baggage_count: 0 });
      const res = await axios.get('http://localhost:3001/api/checkins');
      setCheckins(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error checking in', formType: 'checkin' });
    }
    setLoading(prev => ({ ...prev, checkin: false }));
  };

  const handleGateAssign = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, gateAssign: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.put('http://localhost:3001/api/gates/assign', gateForm);
      setStatus({ show: true, success: true, message: 'Gate assigned!', formType: 'gateAssign' });
      setGateForm({ flight_id: '', gate_id: '' });
      const [flightsRes, gatesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/flights'),
        axios.get('http://localhost:3001/api/gates')
      ]);
      setFlights(flightsRes.data);
      setGates(gatesRes.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error assigning gate', formType: 'gateAssign' });
    }
    setLoading(prev => ({ ...prev, gateAssign: false }));
  };

  const handleGateStatusChange = async (gate_id, newStatus) => {
    setLoading(prev => ({ ...prev, [`gateStatus_${gate_id}`]: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.put(`http://localhost:3001/api/gates/${gate_id}/status`, { status: newStatus });
      setStatus({ show: true, success: true, message: `Gate status updated to ${newStatus}!`, formType: 'gateStatus' });
      const gatesRes = await axios.get('http://localhost:3001/api/gates');
      setGates(gatesRes.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error updating gate status', formType: 'gateStatus' });
    }
    setLoading(prev => ({ ...prev, [`gateStatus_${gate_id}`]: false }));
  };

  const handleGateFree = async (gate_id) => {
    setLoading(prev => ({ ...prev, [`gateFree_${gate_id}`]: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/gates/free', { gate_id });
      setStatus({ show: true, success: true, message: 'Gate freed successfully!', formType: 'gateFree' });
      const [flightsRes, gatesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/flights'),
        axios.get('http://localhost:3001/api/gates')
      ]);
      setFlights(flightsRes.data);
      setGates(gatesRes.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error freeing gate', formType: 'gateFree' });
    }
    setLoading(prev => ({ ...prev, [`gateFree_${gate_id}`]: false }));
  };

  const handleMaintenance = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, maintenance: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/maintenance', maintenanceForm);
      setStatus({ show: true, success: true, message: 'Maintenance scheduled!', formType: 'maintenance' });
      setMaintenanceForm({ flight_id: '', maintenance_type: '', scheduled_date: '' });
      const res = await axios.get('http://localhost:3001/api/maintenance');
      setMaintenance(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error scheduling maintenance', formType: 'maintenance' });
    }
    setLoading(prev => ({ ...prev, maintenance: false }));
  };

  const handleNotification = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, notification: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/notifications', notificationForm);
      setStatus({ show: true, success: true, message: 'Notification sent!', formType: 'notification' });
      setNotificationForm({ flight_id: '', passenger_id: '', message: '', type: 'Info' });
      const res = await axios.get('http://localhost:3001/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error sending notification', formType: 'notification' });
    }
    setLoading(prev => ({ ...prev, notification: false }));
  };

  const handleBaggage = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, baggage: true }));
    setStatus({ show: false, success: false, message: '', formType: '' });
    try {
      await axios.post('http://localhost:3001/api/baggage', baggageForm);
      setStatus({ show: true, success: true, message: 'Baggage added!', formType: 'baggage' });
      setBaggageForm({ passenger_id: '', flight_id: '', tag_number: '', status: 'Checked' });
      const res = await axios.get('http://localhost:3001/api/baggage');
      setBaggage(res.data);
    } catch (err) {
      setStatus({ show: true, success: false, message: err.response?.data?.error || 'Error adding baggage', formType: 'baggage' });
    }
    setLoading(prev => ({ ...prev, baggage: false }));
  };

  const availableResources = resources.filter(r => r.status === 'Available');
  const inUseResources = resources.filter(r => r.status === 'In Use');
  const availableGates = gates.filter(g => g.status === 'Available');

  const tabs = [
    { id: 'flights', label: 'Flights', icon: <FaPlane /> },
    { id: 'resources', label: 'Resources', icon: <FaTools /> },
    { id: 'checkins', label: 'Check-ins', icon: <FaCheckCircle /> },
    { id: 'passengers', label: 'Passengers', icon: <FaUser /> },
    { id: 'gates', label: 'Gates', icon: <FaDoorOpen /> },
    { id: 'maintenance', label: 'Maintenance', icon: <FaWrench /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'baggage', label: 'Baggage', icon: <FaSuitcase /> }
  ];

  return (
    <div className="admin-bg">
      <style>{`
        .admin-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          padding: 2rem 1rem;
        }
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .admin-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e40af;
        }
        .logout-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .logout-btn:hover {
          background: #b91c1c;
        }
        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          white-space: nowrap;
        }
        .admin-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          background: #f3f6fa;
          color: #1e293b;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .admin-tab.active {
          background: #2563eb;
          color: #fff;
        }
        .admin-tab:hover {
          background: #e0eaff;
        }
        .admin-card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .admin-form {
          display: flex;
          flex-wrap: wrap;
          gap: 1.2rem;
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .admin-form-group {
          flex: 1 1 180px;
          min-width: 160px;
        }
        .admin-label {
          display: block;
          font-size: 0.97rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.3rem;
        }
        .admin-input,
        .admin-select {
          width: 100%;
          padding: 0.5rem 0.6rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #fff;
          outline: none;
        }
        .admin-input:focus,
        .admin-select:focus {
          border-color: #2563eb;
        }
        .admin-btn {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.6rem 1.3rem;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .admin-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .admin-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
        }
        .admin-table th,
        .admin-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .admin-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .admin-table tbody tr {
          transition: background 0.2s;
        }
        .admin-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .admin-table tbody tr:hover {
          background: #e0eaff;
        }
        .admin-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        .admin-status {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          font-weight: 500;
          font-size: 1rem;
        }
        .admin-status.success {
          background: #d1fae5;
          color: #047857;
        }
        .admin-status.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .delete-btn {
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.4rem 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .delete-btn:hover {
          background: #b91c1c;
        }
        .free-btn {
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 0.5rem;
          padding: 0.4rem 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }
        .free-btn:hover {
          background: #d97706;
        }
        .admin-select-status {
          padding: 0.3rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          background: #fff;
          outline: none;
        }
        .admin-select-status:focus {
          border-color: #2563eb;
        }
        @media (max-width: 800px) {
          .admin-container {
            padding: 1rem;
          }
          .admin-title {
            font-size: 1.8rem;
          }
          .admin-form {
            flex-direction: column;
            gap: 0.7rem;
          }
          .admin-table th,
          .admin-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
        }
        @media (max-width: 500px) {
          .admin-title {
            font-size: 1.5rem;
          }
          .admin-tabs {
            flex-direction: column;
          }
          .admin-tab {
            padding: 0.5rem 1rem;
          }
          .admin-table th,
          .admin-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Flights Tab */}
        {activeTab === 'flights' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Flights</h2>
            <form className="admin-form" onSubmit={handleFlightAdd}>
              <div className="admin-form-group">
                <label className="admin-label">Flight Code</label>
                <input
                  type="text"
                  value={flightForm.flight_code}
                  onChange={e => setFlightForm({ ...flightForm, flight_code: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Airline</label>
                <input
                  type="text"
                  value={flightForm.airline}
                  onChange={e => setFlightForm({ ...flightForm, airline: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Departure Airport</label>
                <input
                  type="text"
                  value={flightForm.departure_airport}
                  onChange={e => setFlightForm({ ...flightForm, departure_airport: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Arrival Airport</label>
                <input
                  type="text"
                  value={flightForm.arrival_airport}
                  onChange={e => setFlightForm({ ...flightForm, arrival_airport: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Departure Time</label>
                <input
                  type="datetime-local"
                  value={flightForm.departure_time}
                  onChange={e => setFlightForm({ ...flightForm, departure_time: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Arrival Time</label>
                <input
                  type="datetime-local"
                  value={flightForm.arrival_time}
                  onChange={e => setFlightForm({ ...flightForm, arrival_time: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select
                  value={flightForm.status}
                  onChange={e => setFlightForm({ ...flightForm, status: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Boarding">Boarding</option>
                  <option value="Departed">Departed</option>
                  <option value="Arrived">Arrived</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.flightAdd}>
                {loading.flightAdd ? <FaSpinner className="animate-spin" /> : 'Add Flight'}
              </button>
            </form>
            {status.show && status.formType === 'flightAdd' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            {status.show && status.formType === 'flightDelete' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Airline</th>
                    <th>Departure</th>
                    <th>Arrival</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map(flight => (
                    <tr key={flight.flight_id}>
                      <td>{flight.flight_id}</td>
                      <td>{flight.flight_code}</td>
                      <td>{flight.airline}</td>
                      <td>{new Date(flight.departure_time).toLocaleString()}</td>
                      <td>{new Date(flight.arrival_time).toLocaleString()}</td>
                      <td>{flight.status}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleFlightDelete(flight.flight_id)}
                          disabled={loading.flightDelete}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {flights.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-4">
                        No flights available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Resources</h2>
            <form className="admin-form" onSubmit={handleResourceAdd}>
              <div className="admin-form-group">
                <label className="admin-label">Resource Type</label>
                <select
                  value={resourceAddForm.resource_type}
                  onChange={e => setResourceAddForm({ ...resourceAddForm, resource_type: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Staff">Staff</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Resource Name</label>
                <input
                  type="text"
                  value={resourceAddForm.resource_name}
                  onChange={e => setResourceAddForm({ ...resourceAddForm, resource_name: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select
                  value={resourceAddForm.status}
                  onChange={e => setResourceAddForm({ ...resourceAddForm, status: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="In Use">In Use</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.resourceAdd}>
                {loading.resourceAdd ? <FaSpinner className="animate-spin" /> : 'Add Resource'}
              </button>
            </form>
            {status.show && status.formType === 'resourceAdd' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <form className="admin-form" onSubmit={handleResourceAssign}>
              <div className="admin-form-group">
                <label className="admin-label">Resource</label>
                <select
                  value={resourceAssignForm.resource_id}
                  onChange={e => setResourceAssignForm({ ...resourceAssignForm, resource_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Resource</option>
                  {availableResources.map(r => (
                    <option key={r.resource_id} value={r.resource_id}>
                      {r.resource_type} #{r.resource_id} ({r.resource_name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={resourceAssignForm.flight_id}
                  onChange={e => setResourceAssignForm({ ...resourceAssignForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.resourceAssign || availableResources.length === 0}>
                {loading.resourceAssign ? <FaSpinner className="animate-spin" /> : 'Assign Resource'}
              </button>
            </form>
            {status.show && status.formType === 'resourceAssign' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <form className="admin-form" onSubmit={handleResourceFree}>
              <div className="admin-form-group">
                <label className="admin-label">Resource</label>
                <select
                  value={resourceFreeForm.resource_id}
                  onChange={e => setResourceFreeForm({ ...resourceFreeForm, resource_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Resource</option>
                  {inUseResources.map(r => (
                    <option key={r.resource_id} value={r.resource_id}>
                      {r.resource_type} #{r.resource_id} ({r.resource_name})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.resourceFree || inUseResources.length === 0}>
                {loading.resourceFree ? <FaSpinner className="animate-spin" /> : 'Free Resource'}
              </button>
            </form>
            {status.show && status.formType === 'resourceFree' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Flight ID</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map(r => (
                    <tr key={r.resource_id}>
                      <td>{r.resource_id}</td>
                      <td>{r.resource_type}</td>
                      <td>{r.resource_name}</td>
                      <td>{r.status}</td>
                      <td>{r.assigned_flight_id || '-'}</td>
                    </tr>
                  ))}
                  {resources.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4">
                        No resources available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Check-ins Tab */}
        {activeTab === 'checkins' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Check-ins</h2>
            <form className="admin-form" onSubmit={handleCheckin}>
              <div className="admin-form-group">
                <label className="admin-label">Passenger</label>
                <select
                  value={checkinForm.passenger_id}
                  onChange={e => setCheckinForm({ ...checkinForm, passenger_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Passenger</option>
                  {passengers.map(p => (
                    <option key={p.passenger_id} value={p.passenger_id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={checkinForm.flight_id}
                  onChange={e => setCheckinForm({ ...checkinForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Check-in Type</label>
                <select
                  value={checkinForm.checkin_type}
                  onChange={e => setCheckinForm({ ...checkinForm, checkin_type: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Kiosk">Kiosk</option>
                  <option value="Counter">Counter</option>
                  <option value="Online">Online</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Baggage Count</label>
                <input
                  type="number"
                  value={checkinForm.baggage_count}
                  onChange={e => setCheckinForm({ ...checkinForm, baggage_count: e.target.value })}
                  className="admin-input"
                  min="0"
                  required
                />
              </div>
              <button type="submit" className="admin-btn" disabled={loading.checkin}>
                {loading.checkin ? <FaSpinner className="animate-spin" /> : 'Check-in'}
              </button>
            </form>
            {status.show && status.formType === 'checkin' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Passenger ID</th>
                    <th>Flight ID</th>
                    <th>Type</th>
                    <th>Baggage</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map(c => (
                    <tr key={c.checkin_id}>
                      <td>{c.checkin_id}</td>
                      <td>{c.passenger_id}</td>
                      <td>{c.flight_id}</td>
                      <td>{c.checkin_type}</td>
                      <td>{c.baggage_count}</td>
                      <td>{new Date(c.checkin_time).toLocaleString()}</td>
                    </tr>
                  ))}
                  {checkins.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-4">
                        No check-ins available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Passengers Tab */}
        {activeTab === 'passengers' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">View Passengers</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Passport</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map(p => (
                    <tr key={p.passenger_id}>
                      <td>{p.passenger_id}</td>
                      <td>{p.first_name}</td>
                      <td>{p.last_name}</td>
                      <td>{p.passport_no}</td>
                      <td>{p.email}</td>
                      <td>{p.phone}</td>
                    </tr>
                  ))}
                  {passengers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-4">
                        No passengers available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Gates Tab */}
        {activeTab === 'gates' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Gates</h2>
            <form className="admin-form" onSubmit={handleGateAssign}>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={gateForm.flight_id}
                  onChange={e => setGateForm({ ...gateForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Gate</label>
                <select
                  value={gateForm.gate_id}
                  onChange={e => setGateForm({ ...gateForm, gate_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Gate</option>
                  {availableGates.map(g => (
                    <option key={g.gate_id} value={g.gate_id}>
                      Gate {g.gate_number}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.gateAssign || availableGates.length === 0}>
                {loading.gateAssign ? <FaSpinner className="animate-spin" /> : 'Assign Gate'}
              </button>
            </form>
            {status.show && status.formType === 'gateAssign' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            {status.show && status.formType === 'gateStatus' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            {status.show && status.formType === 'gateFree' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Gate Number</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gates.map(g => (
                    <tr key={g.gate_id}>
                      <td>{g.gate_id}</td>
                      <td>{g.gate_number}</td>
                      <td>
                        <select
                          value={g.status}
                          onChange={e => handleGateStatusChange(g.gate_id, e.target.value)}
                          className="admin-select-status"
                          disabled={loading[`gateStatus_${g.gate_id}`]}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                        </select>
                      </td>
                      <td>
                        {g.status === 'Occupied' && (
                          <button
                            className="free-btn"
                            onClick={() => handleGateFree(g.gate_id)}
                            disabled={loading[`gateFree_${g.gate_id}`]}
                          >
                            {loading[`gateFree_${g.gate_id}`] ? <FaSpinner className="animate-spin" /> : 'Free Gate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {gates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        No gates available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Maintenance</h2>
            <form className="admin-form" onSubmit={handleMaintenance}>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={maintenanceForm.flight_id}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Maintenance Type</label>
                <input
                  type="text"
                  value={maintenanceForm.maintenance_type}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, maintenance_type: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Scheduled Date</label>
                <input
                  type="datetime-local"
                  value={maintenanceForm.scheduled_date}
                  onChange={e => setMaintenanceForm({ ...maintenanceForm, scheduled_date: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <button type="submit" className="admin-btn" disabled={loading.maintenance}>
                {loading.maintenance ? <FaSpinner className="animate-spin" /> : 'Schedule Maintenance'}
              </button>
            </form>
            {status.show && status.formType === 'maintenance' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Flight ID</th>
                    <th>Type</th>
                    <th>Scheduled</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenance.map(m => (
                    <tr key={m.maintenance_id}>
                      <td>{m.maintenance_id}</td>
                      <td>{m.flight_id}</td>
                      <td>{m.maintenance_type}</td>
                      <td>{new Date(m.scheduled_date).toLocaleString()}</td>
                    </tr>
                  ))}
                  {maintenance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        No maintenance records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Notifications</h2>
            <form className="admin-form" onSubmit={handleNotification}>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={notificationForm.flight_id}
                  onChange={e => setNotificationForm({ ...notificationForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Passenger</label>
                <select
                  value={notificationForm.passenger_id}
                  onChange={e => setNotificationForm({ ...notificationForm, passenger_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Passenger</option>
                  {passengers.map(p => (
                    <option key={p.passenger_id} value={p.passenger_id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Message</label>
                <input
                  type="text"
                  value={notificationForm.message}
                  onChange={e => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Type</label>
                <select
                  value={notificationForm.type}
                  onChange={e => setNotificationForm({ ...notificationForm, type: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Alert">Alert</option>
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.notification}>
                {loading.notification ? <FaSpinner className="animate-spin" /> : 'Send Notification'}
              </button>
            </form>
            {status.show && status.formType === 'notification' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Flight ID</th>
                    <th>Passenger ID</th>
                    |                    <th>Message</th>
                    <th>Type</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map(n => (
                    <tr key={n.notification_id}>
                      <td>{n.notification_id}</td>
                      <td>{n.flight_id}</td>
                      <td>{n.passenger_id}</td>
                      <td>{n.message}</td>
                      <td>{n.type}</td>
                      <td>{new Date(n.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-500 py-4">
                        No notifications available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Baggage Tab */}
        {activeTab === 'baggage' && (
          <div className="admin-card">
            <h2 className="text-xl font-bold mb-4">Manage Baggage</h2>
            <form className="admin-form" onSubmit={handleBaggage}>
              <div className="admin-form-group">
                <label className="admin-label">Passenger</label>
                <select
                  value={baggageForm.passenger_id}
                  onChange={e => setBaggageForm({ ...baggageForm, passenger_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Passenger</option>
                  {passengers.map(p => (
                    <option key={p.passenger_id} value={p.passenger_id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Flight</label>
                <select
                  value={baggageForm.flight_id}
                  onChange={e => setBaggageForm({ ...baggageForm, flight_id: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(f => (
                    <option key={f.flight_id} value={f.flight_id}>
                      {f.flight_code} ({f.airline})
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Tag Number</label>
                <input
                  type="text"
                  value={baggageForm.tag_number}
                  onChange={e => setBaggageForm({ ...baggageForm, tag_number: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select
                  value={baggageForm.status}
                  onChange={e => setBaggageForm({ ...baggageForm, status: e.target.value })}
                  className="admin-select"
                  required
                >
                  <option value="Checked">Checked</option>
                  <option value="Loaded">Loaded</option>
                  <option value="Unloaded">Unloaded</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <button type="submit" className="admin-btn" disabled={loading.baggage}>
                {loading.baggage ? <FaSpinner className="animate-spin" /> : 'Add Baggage'}
              </button>
            </form>
            {status.show && status.formType === 'baggage' && (
              <div className={`admin-status ${status.success ? 'success' : 'error'}`}>
                {status.success ? <FaCheckCircle /> : <FaTimesCircle />}
                <span>{status.message}</span>
              </div>
            )}
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Passenger ID</th>
                    <th>Flight ID</th>
                    <th>Tag Number</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {baggage.map(b => (
                    <tr key={b.baggage_id}>
                      <td>{b.baggage_id}</td>
                      <td>{b.passenger_id}</td>
                      <td>{b.flight_id}</td>
                      <td>{b.tag_number}</td>
                      <td>{b.status}</td>
                    </tr>
                  ))}
                  {baggage.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4">
                        No baggage records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;