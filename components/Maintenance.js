import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTools } from 'react-icons/fa';

function Maintenance() {
  const [flights, setFlights] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  // Fetch flights and maintenance records on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [flightsRes, maintenanceRes] = await Promise.all([
          axios.get('http://localhost:3001/api/flights'),
          axios.get('http://localhost:3001/api/maintenance')
        ]);
        setFlights(flightsRes.data);
        setMaintenanceRecords(maintenanceRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Determine if a flight is under maintenance
  const isUnderMaintenance = (flightId) => {
    return maintenanceRecords.some(record => record.flight_id === flightId);
  };

  return (
    <div className="maintenance-bg">
      <style>{`
        .maintenance-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .maintenance-container {
          width: 100%;
          max-width: 950px;
          margin: 0 auto;
        }
        .maintenance-card {
          width: 100%;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          overflow: visible;
        }
        .maintenance-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .maintenance-header-icon {
          font-size: 2.8rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .maintenance-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .maintenance-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .maintenance-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
          margin: 2rem;
        }
        .maintenance-table th, .maintenance-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .maintenance-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .maintenance-table tbody tr {
          transition: background 0.2s;
        }
        .maintenance-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .maintenance-table tbody tr:hover {
          background: #e0eaff;
        }
        .maintenance-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        .maintenance-status {
          display: inline-block;
          padding: 0.3em 0.8em;
          border-radius: 0.7em;
          font-weight: 600;
          font-size: 0.95em;
        }
        .maintenance-status.under {
          background: #fee2e2;
          color: #b91c1c;
        }
        .maintenance-status.not {
          background: #d1fae5;
          color: #047857;
        }
        @media (max-width: 600px) {
          .maintenance-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .maintenance-header {
            padding: 1.5rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .maintenance-table {
            margin: 1.5rem 1rem;
          }
          .maintenance-table th, .maintenance-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
          .maintenance-header-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 400px) {
          .maintenance-header-title {
            font-size: 1.1rem;
          }
          .maintenance-header-desc {
            font-size: 0.8rem;
          }
          .maintenance-table th, .maintenance-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="maintenance-container">
        <div className="maintenance-card">
          <div className="maintenance-header">
            <FaTools className="maintenance-header-icon" />
            <div>
              <div className="maintenance-header-title">Aircraft Maintenance Status</div>
              <div className="maintenance-header-desc">View maintenance status for flights</div>
            </div>
          </div>
          <div className="maintenance-table-container">
            <table className="maintenance-table">
              <thead>
                <tr>
                  <th>Flight Code</th>
                  <th>Airline</th>
                  <th>Maintenance Status</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(flight => (
                  <tr key={flight.flight_id}>
                    <td>{flight.flight_code}</td>
                    <td>{flight.airline}</td>
                    <td>
                      <span className={`maintenance-status ${isUnderMaintenance(flight.flight_id) ? 'under' : 'not'}`}>
                        {isUnderMaintenance(flight.flight_id) ? 'Under Maintenance' : 'Not Scheduled'}
                      </span>
                    </td>
                  </tr>
                ))}
                {flights.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{textAlign: 'center', color: '#64748b', padding: '2rem'}}>
                      No flights available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;