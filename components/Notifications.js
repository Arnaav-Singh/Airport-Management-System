import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaBell } from 'react-icons/fa';

function getTypeIcon(type) {
  switch (type) {
    case 'success':
      return <FaCheckCircle />;
    case 'error':
    case 'danger':
      return <FaTimesCircle />;
    case 'warning':
      return <FaExclamationTriangle />;
    default:
      return <FaInfoCircle />;
  }
}

function getTypeClass(type) {
  switch (type) {
    case 'success':
      return 'notification-success';
    case 'error':
    case 'danger':
      return 'notification-error';
    case 'warning':
      return 'notification-warning';
    default:
      return 'notification-info';
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d)) return '';
  return d.toLocaleString();
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const fetchNotifications = () => {
    axios
      .get('http://localhost:3001/api/notifications')
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-bg">
      <style>{`
        .notifications-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .notifications-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          padding: 2rem;
        }
        .notifications-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 1.5rem;
          text-align: left;
          letter-spacing: -1px;
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }
        .notifications-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          border-radius: 0.8rem;
          padding: 1rem 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
          background: #f8fafc;
          transition: background 0.2s;
        }
        .notification-icon {
          font-size: 1.5rem;
          margin-top: 2px;
        }
        .notification-content {
          flex: 1;
        }
        .notification-message {
          font-size: 1.06rem;
          font-weight: 500;
          margin-bottom: 0.2rem;
        }
        .notification-meta {
          font-size: 0.93rem;
          color: #64748b;
        }
        .notification-success {
          background: #d1fae5;
          color: #047857;
        }
        .notification-error {
          background: #fee2e2;
          color: #b91c1c;
        }
        .notification-warning {
          background: #fef3c7;
          color: #92400e;
        }
        .notification-info {
          background: #e0eaff;
          color: #2563eb;
        }
        @media (max-width: 600px) {
          .notifications-card {
            max-width: 100%;
            border-radius: 1rem;
            padding: 1rem;
          }
          .notifications-title {
            font-size: 1.3rem;
          }
          .notification-item {
            padding: 0.7rem 0.6rem;
          }
        }
      `}</style>
      <div className="notifications-card">
        <div className="notifications-title">
          <FaBell /> Notifications
        </div>
        {/* Notifications List */}
        <ul className="notifications-list">
          {notifications.length === 0 && (
            <li className="notification-item notification-info">
              <span className="notification-icon"><FaInfoCircle /></span>
              <div className="notification-content">
                <span className="notification-message">No notifications to display.</span>
              </div>
            </li>
          )}
          {notifications.map((n) => (
            <li
              key={n.notification_id}
              className={`notification-item ${getTypeClass(n.type)}`}
            >
              <span className="notification-icon">{getTypeIcon(n.type)}</span>
              <div className="notification-content">
                <span className="notification-message">{n.message}</span>
                <div className="notification-meta">
                  {n.type && <span style={{textTransform: 'capitalize'}}>{n.type}</span>}
                  {n.created_at && (
                    <span> · {formatDate(n.created_at)}</span>
                  )}
                  {n.flight_id && <span> · Flight ID: {n.flight_id}</span>}
                  {n.passenger_id && <span> · Passenger ID: {n.passenger_id}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Notifications;