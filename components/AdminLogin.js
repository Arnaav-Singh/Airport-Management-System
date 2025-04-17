import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaSpinner } from 'react-icons/fa';

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simple client-side auth (replace with backend auth in production)
    if (form.username === 'admin' && form.password === 'admin123') {
      localStorage.setItem('adminToken', 'dummy-token');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <style>{`
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          padding: 2rem;
        }
        .login-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1e40af;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .login-label {
          font-size: 0.98rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.3rem;
          display: block;
        }
        .login-input-wrapper {
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 0.8rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          font-size: 1.2rem;
        }
        .login-input {
          width: 100%;
          padding: 0.7rem 0.7rem 0.7rem 2.5rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 0.7rem;
          font-size: 1rem;
          outline: none;
          background: #f8fafc;
          transition: border 0.2s;
        }
        .login-input:focus {
          border-color: #2563eb;
          background: #fff;
        }
        .login-error {
          color: #b91c1c;
          font-size: 0.95rem;
          text-align: center;
        }
        .login-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.7rem;
          padding: 0.85rem;
          border: none;
          border-radius: 0.8rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .login-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        @media (max-width: 400px) {
          .login-card {
            padding: 1.5rem;
          }
          .login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
      <div className="login-card">
        <h2 className="login-title">Admin Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label className="login-label">Username</label>
            <div className="login-input-wrapper">
              <FaLock className="login-input-icon" />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="login-input"
                required
                placeholder="Enter username"
                aria-label="Username"
              />
            </div>
          </div>
          <div>
            <label className="login-label">Password</label>
            <div className="login-input-wrapper">
              <FaLock className="login-input-icon" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="login-input"
                required
                placeholder="Enter password"
                aria-label="Password"
              />
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;