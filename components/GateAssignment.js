import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlane, FaSpinner, FaTimesCircle } from 'react-icons/fa';

function GateAssignmentsDisplay() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ show: false, success: false, message: '' });

  // Fetch flights and gates on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [flightsRes, gatesRes] = await Promise.all([
          axios.get('http://localhost:3001/api/flights'),
          axios.get('http://localhost:3001/api/gates')
        ]);

        // Create gate lookup for efficient mapping
        const gateMap = gatesRes.data.reduce((map, gate) => ({
          ...map,
          [gate.gate_id]: gate
        }), {});

        // Map flights to assignments
        const assignmentsData = flightsRes.data.map(flight => ({
          flight_id: flight.flight_id,
          flight_code: flight.flight_code,
          airline: flight.airline,
          gate: flight.gate_id && gateMap[flight.gate_id]
            ? `Gate ${gateMap[flight.gate_id].gate_number}`
            : 'Not Assigned'
        }));

        setAssignments(assignmentsData);
      } catch (err) {
        setStatus({ show: true, success: false, message: 'Error fetching assignments' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="gate-display-bg">
      <style>{`
        .gate-display-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .gate-display-card {
          width: 100%;
          max-width: 800px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          overflow: visible;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .gate-display-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem 2rem 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .gate-display-header-icon {
          font-size: 2.8rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .gate-display-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .gate-display-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .gate-display-content {
          padding: 2rem;
        }
        .gate-display-status {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          font-weight: 500;
          font-size: 1rem;
          background: #fee2e2;
          color: #b91c1c;
          margin-bottom: 1.5rem;
        }
        .gate-display-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
        }
        .gate-display-table th,
        .gate-display-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .gate-display-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .gate-display-table tbody tr {
          transition: background 0.2s;
        }
        .gate-display-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .gate-display-table tbody tr:hover {
          background: #e0eaff;
        }
        .gate-display-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        .gate-display-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          font-size: 1.2rem;
          color: #1e293b;
          padding: 2rem;
        }
        @media (max-width: 600px) {
          .gate-display-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .gate-display-header {
            padding: 1.5rem 1rem 1rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .gate-display-content {
            padding: 1.5rem 1rem;
          }
          .gate-display-header-title {
            font-size: 1.5rem;
          }
          .gate-display-table th,
          .gate-display-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
        }
        @media (max-width: 400px) {
          .gate-display-header-title {
            font-size: 1.1rem;
          }
          .gate-display-header-desc {
            font-size: 0.8rem;
          }
          .gate-display-table th,
          .gate-display-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="gate-display-card">
        <div className="gate-display-header">
          <FaPlane className="gate-display-header-icon" />
          <div>
            <div className="gate-display-header-title">Gate Assignments</div>
            <div className="gate-display-header-desc">View flights and their assigned gates</div>
          </div>
        </div>
        <div className="gate-display-content">
          {status.show && (
            <div className="gate-display-status">
              <FaTimesCircle style={{ fontSize: '1.3em' }} />
              <span>{status.message}</span>
            </div>
          )}
          {loading ? (
            <div className="gate-display-loading">
              <FaSpinner className="animate-spin" />
              <span>Loading assignments...</span>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="gate-display-table">
                <thead>
                  <tr>
                    <th>Flight Code</th>
                    <th>Airline</th>
                    <th>Gate</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.flight_id}>
                      <td>{assignment.flight_code}</td>
                      <td>{assignment.airline}</td>
                      <td>{assignment.gate}</td>
                    </tr>
                  ))}
                  {assignments.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center text-gray-500 py-4">
                        No flights available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GateAssignmentsDisplay;