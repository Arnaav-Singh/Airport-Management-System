import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTools } from 'react-icons/fa';

function ResourceAllocation() {
  const [resources, setResources] = useState([]);
  const [flights, setFlights] = useState([]);

  // Fetch resources and flights on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesRes, flightsRes] = await Promise.all([
          axios.get('http://localhost:3001/api/resources'),
          axios.get('http://localhost:3001/api/flights')
        ]);
        setResources(resourcesRes.data);
        setFlights(flightsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Filter resources to show only those allocated (In Use)
  const allocatedResources = resources.filter(r => r.status === 'In Use');

  return (
    <div className="resource-bg">
      <style>{`
        .resource-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0eaff 0%, #b3c8fa 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .resource-container {
          width: 100%;
          max-width: 950px;
          margin: 0 auto;
        }
        .resource-card {
          width: 100%;
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          border: 1.5px solid #c7d2fe;
          overflow: visible;
        }
        .resource-header {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
        }
        .resource-header-icon {
          font-size: 2.8rem;
          color: #fff;
          filter: drop-shadow(0 2px 8px rgba(31, 38, 135, 0.16));
        }
        .resource-header-title {
          font-size: 2rem;
          font-weight: bold;
          color: #fff;
        }
        .resource-header-desc {
          color: #dbeafe;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .resource-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: #fff;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.07);
          margin: 2rem;
        }
        .resource-table th, .resource-table td {
          padding: 1rem 0.7rem;
          text-align: left;
        }
        .resource-table th {
          background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          border-bottom: 2px solid #c7d2fe;
        }
        .resource-table tbody tr {
          transition: background 0.2s;
        }
        .resource-table tbody tr:nth-child(even) {
          background: #f3f6fa;
        }
        .resource-table tbody tr:hover {
          background: #e0eaff;
        }
        .resource-table td {
          font-size: 0.98rem;
          color: #1e293b;
          border-bottom: 1px solid #e5e7eb;
        }
        @media (max-width: 600px) {
          .resource-card {
            max-width: 100%;
            border-radius: 1rem;
          }
          .resource-header {
            padding: 1.5rem 1rem;
            border-top-left-radius: 1rem;
            border-top-right-radius: 1rem;
          }
          .resource-table {
            margin: 1.5rem 1rem;
          }
          .resource-table th, .resource-table td {
            padding: 0.7rem 0.3rem;
            font-size: 0.93rem;
          }
          .resource-header-title {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 400px) {
          .resource-header-title {
            font-size: 1.1rem;
          }
          .resource-header-desc {
            font-size: 0.8rem;
          }
          .resource-table th, .resource-table td {
            padding: 0.4rem 0.2rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
      <div className="resource-container">
        <div className="resource-card">
          <div className="resource-header">
            <FaTools className="resource-header-icon" />
            <div>
              <div className="resource-header-title">Resource Allocations</div>
              <div className="resource-header-desc">View resources assigned to flights</div>
            </div>
          </div>
          <div className="resource-table-container">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Resource Type</th>
                  <th>Resource Name</th>
                  <th>Assigned Flight</th>
                </tr>
              </thead>
              <tbody>
                {allocatedResources.map(resource => {
                  const flight = flights.find(f => f.flight_id === resource.flight_id);
                  return (
                    <tr key={resource.resource_id}>
                      <td>{resource.resource_type}</td>
                      <td>{resource.resource_name}</td>
                      <td>{flight ? `${flight.flight_code} (${flight.airline})` : 'Unknown Flight'}</td>
                    </tr>
                  );
                })}
                {allocatedResources.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{textAlign: 'center', color: '#64748b', padding: '2rem'}}>
                      No resources allocated.
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

export default ResourceAllocation;