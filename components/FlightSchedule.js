import { useState, useEffect } from 'react';
import axios from 'axios';

function FlightSchedule() {
  const [flights, setFlights] = useState([]);

  // Fetch flights
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = () => {
    axios
      .get('http://localhost:3001/api/flights')
      .then((res) => setFlights(res.data))
      .catch((err) => console.error(err));
  };

  // Map database status to display-friendly status
  const displayStatus = (status) => {
    const statusMap = {
      Scheduled: 'On Time',
      Boarding: 'Boarding',
      Departed: 'Departed',
      Arrived: 'Arrived',
      Delayed: 'Delayed',
      Cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="flight-bg">
      <style>{`
        .flight-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .flight-card {
          width: 100%;
          max-width: 950px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          padding: 2rem;
          margin: 0 auto;
        }
        .flight-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 1.5rem;
          text-align: left;
          letter-spacing: -1px;
        }
        .flight-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
        }
        .flight-table th, .flight-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .flight-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .flight-table tbody tr {
          transition: background 0.2s;
        }
        .flight-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .flight-table tbody tr:hover {
          background: #e0eaff;
        }
        .flight-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        .flight-status {
          display: inline-block;
          padding: 0.3em 0.8em;
          border-radius: 0.7em;
          font-weight: 600;
          font-size: 0.95em;
          background: #f1f5f9;
        }
        .flight-status.OnTime, .flight-status.Scheduled {
          background: #d1fae5;
          color: #047857;
        }
        .flight-status.Delayed {
          background: #fee2e2;
          color: #b91c1c;
        }
        .flight-status.Cancelled {
          background: #fef3c7;
          color: #92400e;
        }
        .flight-status.Boarding {
          background: #dbeafe;
          color: #1e40af;
        }
        .flight-status.Departed {
          background: #e0e7ff;
          color: #4f46e5;
        }
        .flight-status.Arrived {
          background: #ecfdf5;
          color: #15803d;
        }
        @media (max-width: 800px) {
          .flight-card {
            padding: 1rem;
          }
          .flight-title {
            font-size: 1.3rem;
          }
          .flight-table th, .flight-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
        }
        @media (max-width: 500px) {
          .flight-card {
            max-width: 100%;
            border-radius: 1rem;
            padding: 0.5rem;
          }
          .flight-title {
            font-size: 1.1rem;
          }
          .flight-table th, .flight-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="flight-card">
        <h2 className="flight-title">Flight Schedule</h2>

        {/* Flight Table */}
        <div style={{overflowX: 'auto', marginTop: '1.5rem'}}>
          <table className="flight-table">
            <thead>
              <tr>
                <th>Flight Code</th>
                <th>Airline</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.flight_id}>
                  <td>{flight.flight_code}</td>
                  <td>{flight.airline}</td>
                  <td>{new Date(flight.departure_time).toLocaleString()}</td>
                  <td>{new Date(flight.arrival_time).toLocaleString()}</td>
                  <td>
                    <span className={`flight-status ${flight.status}`}>
                      {displayStatus(flight.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', color: '#64748b', padding: '2rem'}}>
                    No flights scheduled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FlightSchedule;