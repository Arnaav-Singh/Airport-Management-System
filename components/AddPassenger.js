import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function AddPassenger() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    passport_no: '',
    email: '',
    phone: ''
  });
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState({ submit: false, fetch: false });
  const [status, setStatus] = useState({ show: false, success: false, message: '' });

  // Fetch passengers on mount
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        const res = await axios.get('http://localhost:3001/api/passengers');
        setPassengers(res.data);
      } catch (err) {
        setStatus({ show: true, success: false, message: 'Error fetching passengers', formType: 'fetch' });
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    fetchPassengers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    setStatus({ show: false, success: false, message: '' });
    try {
      await axios.post('http://localhost:3001/api/passengers', form);
      setStatus({ show: true, success: true, message: 'Passenger added successfully!' });
      setForm({
        first_name: '',
        last_name: '',
        passport_no: '',
        email: '',
        phone: ''
      });
      // Refresh passenger list
      const res = await axios.get('http://localhost:3001/api/passengers');
      setPassengers(res.data);
    } catch (err) {
      setStatus({
        show: true,
        success: false,
        message: err.response?.data?.error || `Error: ${err.message}`
      });
    }
    setLoading(prev => ({ ...prev, submit: false }));
  };

  return (
    <div className="passenger-bg">
      <style>{`
        .passenger-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .passenger-card {
          width: 100%;
          max-width: 500px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          overflow: visible;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .passenger-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem 2rem 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .passenger-header-icon {
          font-size: 2.8rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .passenger-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .passenger-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .passenger-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .passenger-status {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.8rem 1rem;
          border-radius: 0.7rem;
          font-weight: 500;
          font-size: 1rem;
          transition: background 0.3s;
        }
        .passenger-status.success {
          background: #d1fae5;
          color: #047857;
        }
        .passenger-status.error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .passenger-label {
          font-size: 0.98rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.3rem;
          display: block;
        }
        .passenger-input-wrapper {
          position: relative;
        }
        .passenger-input-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.2rem;
          pointer-events: none;
        }
        .passenger-input {
          width: 100%;
          padding: 0.7rem 0.7rem 0.7rem 2.5rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.7rem;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
          background: #f8fafc;
          box-sizing: border-box;
        }
        .passenger-input:focus {
          border-color: #2563eb;
          background: #fff;
        }
        .passenger-helper {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 0.15rem;
          margin-left: 2.5rem;
          white-space: normal;
          word-wrap: break-word;
        }
        .passenger-btn {
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
        .passenger-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .passenger-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
          margin-top: 2rem;
        }
        .passenger-table th,
        .passenger-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .passenger-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .passenger-table tbody tr {
          transition: background 0.2s;
        }
        .passenger-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .passenger-table tbody tr:hover {
          background: #e0eaff;
        }
        .passenger-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        @media (max-width: 600px) {
          .passenger-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .passenger-header {
            padding: 1.5rem 1rem 1rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .passenger-form {
            padding: 1.5rem 1rem;
          }
          .passenger-header-title {
            font-size: 1.5rem;
          }
          .passenger-table th,
          .passenger-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
        }
        @media (max-width: 400px) {
          .passenger-header-title {
            font-size: 1.1rem;
          }
          .passenger-header-desc {
            font-size: 0.8rem;
          }
          .passenger-table th,
          .passenger-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="passenger-card">
        <div className="passenger-header">
          <FaUser className="passenger-header-icon" />
          <div>
            <div className="passenger-header-title">Add Passenger</div>
            <div className="passenger-header-desc">Enter passenger details to register</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="passenger-form">
          {status.show && (
            <div className={`passenger-status ${status.success ? 'success' : 'error'}`}>
              {status.success ? <FaCheckCircle style={{ fontSize: '1.3em' }} /> : <FaTimesCircle style={{ fontSize: '1.3em' }} />}
              <span>{status.message}</span>
            </div>
          )}
          <div>
            <label className="passenger-label">First Name</label>
            <div className="passenger-input-wrapper">
              <FaUser className="passenger-input-icon" />
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="passenger-input"
                required
                placeholder="e.g. John"
                aria-label="First Name"
              />
            </div>
            <div className="passenger-helper">Enter the passenger's first name</div>
          </div>
          <div>
            <label className="passenger-label">Last Name</label>
            <div className="passenger-input-wrapper">
              <FaUser className="passenger-input-icon" />
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="passenger-input"
                required
                placeholder="e.g. Doe"
                aria-label="Last Name"
              />
            </div>
            <div className="passenger-helper">Enter the passenger's last name</div>
          </div>
          <div>
            <label className="passenger-label">Passport Number</label>
            <div className="passenger-input-wrapper">
              <FaUser className="passenger-input-icon" />
              <input
                type="text"
                value={form.passport_no}
                onChange={(e) => setForm({ ...form, passport_no: e.target.value })}
                className="passenger-input"
                required
                placeholder="e.g. X1234567"
                aria-label="Passport Number"
              />
            </div>
            <div className="passenger-helper">Enter a unique passport number</div>
          </div>
          <div>
            <label className="passenger-label">Email</label>
            <div className="passenger-input-wrapper">
              <FaUser className="passenger-input-icon" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="passenger-input"
                required
                placeholder="e.g. john.doe@example.com"
                aria-label="Email"
              />
            </div>
            <div className="passenger-helper">Enter a valid email address</div>
          </div>
          <div>
            <label className="passenger-label">Phone</label>
            <div className="passenger-input-wrapper">
              <FaUser className="passenger-input-icon" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="passenger-input"
                required
                placeholder="e.g. 123-456-7890"
                aria-label="Phone"
              />
            </div>
            <div className="passenger-helper">Enter the passenger's phone number</div>
          </div>
          <button
            type="submit"
            className="passenger-btn"
            disabled={loading.submit}
            aria-busy={loading.submit}
          >
            {loading.submit ? (
              <>
                <FaSpinner className="animate-spin" /> Adding...
              </>
            ) : (
              'Add Passenger'
            )}
          </button>
        </form>
        {/* Optional: Display passengers table */}
        {passengers.length > 0 && (
          <div style={{ overflowX: 'auto', padding: '2rem' }}>
            <table className="passenger-table">
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
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddPassenger;