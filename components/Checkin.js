import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPlane, FaLaptop, FaSuitcase, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function Checkin() {
  const [form, setForm] = useState({ 
    passenger_id: '', 
    flight_id: '', 
    checkin_type: 'Kiosk', 
    baggage_count: 0 
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, success: false, message: '' });
  const [passengerData, setPassengerData] = useState(null);
  const [flightData, setFlightData] = useState(null);
  const [passengerError, setPassengerError] = useState('');
  const [flightError, setFlightError] = useState('');
  const [passengerLoading, setPassengerLoading] = useState(false);
  const [flightLoading, setFlightLoading] = useState(false);
  const [checkinExists, setCheckinExists] = useState(false);
  const [checkinCheckLoading, setCheckinCheckLoading] = useState(false);

  // Fetch passenger data when passenger_id changes
  useEffect(() => {
    if (form.passenger_id) {
      setPassengerLoading(true);
      setPassengerError('');
      axios.get(`http://localhost:3001/api/passengers/${form.passenger_id}`)
        .then(res => {
          setPassengerData(res.data);
          setPassengerError('');
        })
        .catch(err => {
          setPassengerData(null);
          setPassengerError(err.response?.data?.error || 'Error fetching passenger data');
        })
        .finally(() => setPassengerLoading(false));
    } else {
      setPassengerData(null);
      setPassengerError('');
    }
  }, [form.passenger_id]);

  // Fetch flight data when flight_id changes
  useEffect(() => {
    if (form.flight_id) {
      setFlightLoading(true);
      setFlightError('');
      axios.get(`http://localhost:3001/api/flights/${form.flight_id}`)
        .then(res => {
          setFlightData(res.data);
          setFlightError('');
        })
        .catch(err => {
          setFlightData(null);
          setFlightError(err.response?.data?.error || 'Error fetching flight data');
        })
        .finally(() => setFlightLoading(false));
    } else {
      setFlightData(null);
      setFlightError('');
    }
  }, [form.flight_id]);

  // Check if check-in exists when both passenger_id and flight_id are set
  useEffect(() => {
    if (form.passenger_id && form.flight_id) {
      setCheckinCheckLoading(true);
      axios.get('http://localhost:3001/api/checkins/exists', {
        params: { passenger_id: form.passenger_id, flight_id: form.flight_id }
      })
        .then(res => {
          setCheckinExists(res.data.exists);
        })
        .catch(err => {
          console.error('Error checking check-in:', err);
        })
        .finally(() => setCheckinCheckLoading(false));
    } else {
      setCheckinExists(false);
    }
  }, [form.passenger_id, form.flight_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ show: false, success: false, message: '' });
    try {
      await axios.post('http://localhost:3001/api/checkin', form);
      setStatus({ 
        show: true, 
        success: true, 
        message: 'Check-in completed successfully!' 
      });
      setForm({ passenger_id: '', flight_id: '', checkin_type: 'Kiosk', baggage_count: 0 });
      setPassengerData(null);
      setFlightData(null);
      setCheckinExists(false);
    } catch (err) {
      setStatus({ 
        show: true, 
        success: false, 
        message: err.response?.data?.error || `Error: ${err.message}` 
      });
    }
    setLoading(false);
  };

  return (
    <div className="checkin-bg">
      {/* Inline CSS Styles */}
      <style>{`
        .checkin-bg {
          min-height: 100vh;
          height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 1rem;
          box-sizing: border-box;
        }
        .checkin-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          overflow: visible;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .checkin-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem 2rem 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .checkin-header-icon {
          font-size: 2.8rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .checkin-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .checkin-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .checkin-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .checkin-status {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          font-weight: 500;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .checkin-status.success {
          background: #d1fae5;
          color: #047857;
        }
        .checkin-status.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .checkin-label {
          font-size: 0.98rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.3rem;
          display: block;
        }
        .checkin-input-wrapper {
          position: relative;
        }
        .checkin-input-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.2rem;
          pointer-events: none;
        }
        .checkin-input,
        .checkin-select {
          width: 100%;
          padding: 0.7rem 0.7rem 0.7rem 2.5rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.7rem;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
          background: #f8fafc;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .checkin-input:focus,
        .checkin-select:focus {
          border-color: #2563eb;
          background: #fff;
        }
        .checkin-helper {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 0.15rem;
          margin-left: 2.5rem;
          white-space: normal;
          word-wrap: break-word;
        }
        .checkin-range-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }
        .checkin-range {
          flex: 1;
          min-width: 0;
          accent-color: #2563eb;
        }
        .checkin-range-value {
          font-size: 1.1rem;
          font-weight: bold;
          color: #2563eb;
          min-width: 2.2rem;
          text-align: center;
        }
        .checkin-divider {
          border: none;
          border-top: 1.5px solid #e0e7ef;
          margin: 1.5rem 0;
        }
        .checkin-btn {
          margin-top: 1.5rem;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.7rem;
          padding: 0.85rem 1.2rem;
          border: none;
          border-radius: 0.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .checkin-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .data-display {
          margin-top: 0.5rem;
          padding: 0.8rem;
          border-radius: 0.5rem;
          background: #f1f5f9;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .data-display.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .data-display.loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
        }
        @media (max-width: 600px) {
          .checkin-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .checkin-header {
            padding: 1.5rem 1rem 1rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .checkin-form {
            padding: 1.5rem 1rem;
          }
          .checkin-header-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 400px) {
          .checkin-header-title {
            font-size: 1.1rem;
          }
          .checkin-header-desc {
            font-size: 0.8rem;
          }
        }
      `}</style>
      <div className="checkin-card">
        {/* Header */}
        <div className="checkin-header">
          <FaPlane className="checkin-header-icon" />
          <div>
            <div className="checkin-header-title">Passenger Check-in</div>
            <div className="checkin-header-desc">Fast & easy boarding pass processing</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="checkin-form">
          {/* Status Message */}
          {status.show && (
            <div className={`checkin-status ${status.success ? 'success' : 'error'}`}>
              {status.success 
                ? <FaCheckCircle style={{fontSize: '1.3em'}} />
                : <FaTimesCircle style={{fontSize: '1.3em'}} />
              }
              <span>{status.message}</span>
            </div>
          )}

          {/* Passenger ID */}
          <div>
            <label htmlFor="passenger_id" className="checkin-label">
              Passenger ID
            </label>
            <div className="checkin-input-wrapper">
              <FaUser className="checkin-input-icon" />
              <input
                id="passenger_id"
                type="number"
                placeholder="e.g. 12345"
                value={form.passenger_id}
                onChange={(e) => setForm({ ...form, passenger_id: e.target.value })}
                className="checkin-input"
                required
                aria-label="Passenger ID"
              />
            </div>
            <div className="checkin-helper">Enter your unique passenger number</div>
            {passengerLoading && (
              <div className="data-display loading">
                <FaSpinner className="animate-spin" /> Loading passenger data...
              </div>
            )}
            {passengerError && (
              <div className="data-display error">{passengerError}</div>
            )}
            {passengerData && !passengerLoading && !passengerError && (
              <div className="data-display">
                <p><strong>Name:</strong> {passengerData.first_name} {passengerData.last_name}</p>
                <p><strong>Passport:</strong> {passengerData.passport_no}</p>
                <p><strong>Email:</strong> {passengerData.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {passengerData.phone || 'N/A'}</p>
              </div>
            )}
          </div>

          {/* Flight ID */}
          <div>
            <label htmlFor="flight_id" className="checkin-label">
              Flight ID
            </label>
            <div className="checkin-input-wrapper">
              <FaPlane className="checkin-input-icon" />
              <input
                id="flight_id"
                type="number"
                placeholder="e.g. 67890"
                value={form.flight_id}
                onChange={(e) => setForm({ ...form, flight_id: e.target.value })}
                className="checkin-input"
                required
                aria-label="Flight ID"
              />
            </div>
            <div className="checkin-helper">Enter your flight number</div>
            {flightLoading && (
              <div className="data-display loading">
                <FaSpinner className="animate-spin" /> Loading flight data...
              </div>
            )}
            {flightError && (
              <div className="data-display error">{flightError}</div>
            )}
            {flightData && !flightLoading && !flightError && (
              <div className="data-display">
                <p><strong>Flight Code:</strong> {flightData.flight_code}</p>
                <p><strong>Airline:</strong> {flightData.airline}</p>
                <p><strong>Departure:</strong> {new Date(flightData.departure_time).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {new Date(flightData.arrival_time).toLocaleString()}</p>
                <p><strong>Status:</strong> {flightData.status}</p>
                <p><strong>Gate:</strong> {flightData.gate_id || 'N/A'}</p>
              </div>
            )}
            {checkinExists && !checkinCheckLoading && (
              <div className="data-display error">
                This passenger has already checked in for this flight.
              </div>
            )}
          </div>

          <hr className="checkin-divider" />

          {/* Check-in Type */}
          <div>
            <label htmlFor="checkin_type" className="checkin-label">
              Check-in Method
            </label>
            <div className="checkin-input-wrapper">
              <FaLaptop className="checkin-input-icon" />
              <select
                id="checkin_type"
                value={form.checkin_type}
                onChange={(e) => setForm({ ...form, checkin_type: e.target.value })}
                className="checkin-select"
                aria-label="Check-in Method"
              >
                <option value="Kiosk">Kiosk</option>
                <option value="Staff">Staff</option>
                <option value="Online">Online</option>
                <option value="Mobile">Mobile App</option>
              </select>
            </div>
          </div>

          {/* Baggage Count */}
          <div>
            <label htmlFor="baggage_count" className="checkin-label">
              Baggage Count
            </label>
            <div className="checkin-range-wrapper">
              <span style={{position: 'relative'}}>
                <FaSuitcase className="checkin-input-icon" style={{left: 0, top: '50%', transform: 'translateY(-50%)'}} />
              </span>
              <input
                id="baggage_count"
                type="range"
                min="0"
                max="10"
                value={form.baggage_count}
                onChange={(e) => setForm({ ...form, baggage_count: e.target.value })}
                className="checkin-range"
                aria-label="Baggage Count"
              />
              <span className="checkin-range-value">{form.baggage_count}</span>
            </div>
            <div className="checkin-helper">How many bags are you checking in?</div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="checkin-btn"
            disabled={loading || passengerError || flightError || checkinExists || checkinCheckLoading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Processing...
              </>
            ) : (
              'Complete Check-in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkin;