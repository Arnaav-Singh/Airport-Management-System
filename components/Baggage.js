import { useState } from 'react';
import axios from 'axios';
import { FaSuitcase, FaSpinner, FaCheckCircle, FaTimesCircle, FaPlane, FaUser } from 'react-icons/fa';

function Baggage() {
  const [tagNumber, setTagNumber] = useState('');
  const [baggage, setBaggage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ show: false, success: false, message: '' });

  const handleSearch = async () => {
    setLoading(true);
    setStatus({ show: false, success: false, message: '' });
    setBaggage(null);
    try {
      const res = await axios.get(`http://localhost:3001/api/baggage/${tagNumber}`);
      if (res.data && Object.keys(res.data).length > 0) {
        setBaggage(res.data);
        setStatus({ show: true, success: true, message: 'Baggage found!' });
      } else {
        setStatus({ show: true, success: false, message: 'No baggage found for this tag.' });
      }
    } catch (err) {
      setStatus({ show: true, success: false, message: 'Error: ' + err.message });
    }
    setLoading(false);
  };

  return (
    <div className="baggage-bg">
      <style>{`
        .baggage-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .baggage-card {
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
        .baggage-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem 2rem 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .baggage-header-icon {
          font-size: 2.4rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .baggage-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .baggage-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .baggage-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .baggage-search-row {
          display: flex;
          gap: 0.7rem;
          margin-bottom: 0.5rem;
        }
        .baggage-input-wrapper {
          position: relative;
          flex: 1;
        }
        .baggage-input-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.2rem;
          pointer-events: none;
        }
        .baggage-input {
          width: 100%;
          padding: 0.7rem 0.7rem 0.7rem 2.5rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.7rem;
          font-size: 1rem;
          outline: none;
          background: #f8fafc;
          box-sizing: border-box;
        }
        .baggage-input:focus {
          border-color: #2563eb;
          background: #fff;
        }
        .baggage-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          border: none;
          border-radius: 0.7rem;
          padding: 0.7rem 1.2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          min-width: 100px;
          justify-content: center;
        }
        .baggage-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .baggage-status {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 1rem;
          transition: background 0.3s;
        }
        .baggage-status.success {
          background: #d1fae5;
          color: #047857;
        }
        .baggage-status.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .baggage-details {
          background: #f8fafc;
          border-radius: 1rem;
          padding: 1.2rem 1rem;
          margin-top: 0.5rem;
          box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.07);
          font-size: 1.05rem;
        }
        .baggage-detail-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }
        .baggage-detail-label {
          font-weight: 600;
          color: #1e293b;
          min-width: 110px;
        }
        .baggage-detail-value {
          color: #2563eb;
        }
        @media (max-width: 600px) {
          .baggage-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .baggage-header {
            padding: 1.5rem 1rem 1rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .baggage-form {
            padding: 1.5rem 1rem;
          }
          .baggage-header-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 400px) {
          .baggage-header-title {
            font-size: 1.1rem;
          }
          .baggage-header-desc {
            font-size: 0.8rem;
          }
        }
      `}</style>
      <div className="baggage-card">
        {/* Header */}
        <div className="baggage-header">
          <FaSuitcase className="baggage-header-icon" />
          <div>
            <div className="baggage-header-title">Baggage Tracking</div>
            <div className="baggage-header-desc">Track your baggage by tag number</div>
          </div>
        </div>
        <div className="baggage-form">
          {/* Status Message */}
          {status.show && (
            <div className={`baggage-status ${status.success ? 'success' : 'error'}`}>
              {status.success 
                ? <FaCheckCircle style={{fontSize: '1.3em'}} />
                : <FaTimesCircle style={{fontSize: '1.3em'}} />
              }
              <span>{status.message}</span>
            </div>
          )}
          <div className="baggage-search-row">
            <div className="baggage-input-wrapper">
              <FaSuitcase className="baggage-input-icon" />
              <input
                type="text"
                placeholder="Baggage Tag Number"
                value={tagNumber}
                onChange={(e) => setTagNumber(e.target.value)}
                className="baggage-input"
                disabled={loading}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="baggage-btn"
              disabled={loading || !tagNumber}
              type="button"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Track'}
            </button>
          </div>
          {/* Baggage Details */}
          {baggage && Object.keys(baggage).length > 0 && (
            <div className="baggage-details">
              <div className="baggage-detail-row">
                <span className="baggage-detail-label"><FaSuitcase /> Status:</span>
                <span className="baggage-detail-value">{baggage.status}</span>
              </div>
              <div className="baggage-detail-row">
                <span className="baggage-detail-label"><FaUser /> Passenger ID:</span>
                <span className="baggage-detail-value">{baggage.passenger_id}</span>
              </div>
              <div className="baggage-detail-row">
                <span className="baggage-detail-label"><FaPlane /> Flight ID:</span>
                <span className="baggage-detail-value">{baggage.flight_id}</span>
              </div>
              {baggage.tag_number && (
                <div className="baggage-detail-row">
                  <span className="baggage-detail-label">Tag Number:</span>
                  <span className="baggage-detail-value">{baggage.tag_number}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Baggage;
