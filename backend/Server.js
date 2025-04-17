const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Welcome2023',
    database: 'airport_management'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// 1. Passenger Check-in
app.post('/api/checkin', (req, res) => {
    const { passenger_id, flight_id, checkin_type, baggage_count } = req.body;
    
    if (!passenger_id || !flight_id || !checkin_type || baggage_count < 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    if (!['Kiosk', 'Staff'].includes(checkin_type)) {
        return res.status(400).json({ error: 'Invalid checkin_type' });
    }

    // Check if check-in already exists
    const checkQuery = 'SELECT checkin_id FROM checkins WHERE passenger_id = ? AND flight_id = ?';
    db.query(checkQuery, [passenger_id, flight_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ error: 'Passenger has already checked in for this flight' });
        }

        // Proceed with check-in
        const insertQuery = 'INSERT INTO checkins (passenger_id, flight_id, checkin_type, baggage_count) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [passenger_id, flight_id, checkin_type, baggage_count], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Passenger has already checked in for this flight' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({ checkin_id: result.insertId });
        });
    });
});

// Fetch all check-ins
app.get('/api/checkins', (req, res) => {
    const query = 'SELECT * FROM checkins';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Check if check-in exists for a passenger and flight
app.get('/api/checkins/exists', (req, res) => {
    const { passenger_id, flight_id } = req.query;
    if (!passenger_id || !flight_id) {
        return res.status(400).json({ error: 'Missing passenger_id or flight_id' });
    }
    const query = 'SELECT checkin_id FROM checkins WHERE passenger_id = ? AND flight_id = ?';
    db.query(query, [passenger_id, flight_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ exists: results.length > 0 });
    });
});

// Fetch all passengers
app.get('/api/passengers', (req, res) => {
    const query = 'SELECT * FROM passengers';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Fetch passenger by ID
app.get('/api/passengers/:passenger_id', (req, res) => {
    const query = 'SELECT * FROM passengers WHERE passenger_id = ?';
    db.query(query, [req.params.passenger_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Passenger not found' });
        res.json(results[0]);
    });
});

// Add passenger
app.post('/api/passengers', (req, res) => {
    const { first_name, last_name, passport_no, email, phone } = req.body;
    if (!first_name || !last_name || !passport_no) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const query = 'INSERT INTO passengers (first_name, last_name, passport_no, email, phone) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [first_name, last_name, passport_no, email, phone], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Passport number already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ passenger_id: result.insertId });
    });
});

// 2. Flight Schedule Management
app.get('/api/flights', (req, res) => {
    const query = 'SELECT * FROM flights';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Fetch flight by ID
app.get('/api/flights/:flight_id', (req, res) => {
    const query = 'SELECT * FROM flights WHERE flight_id = ?';
    db.query(query, [req.params.flight_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Flight not found' });
        res.json(results[0]);
    });
});

app.post('/api/flights', (req, res) => {
    const { flight_code, airline, departure_airport, arrival_airport, departure_time, arrival_time, status } = req.body;
    if (!flight_code || !airline || !departure_airport || !arrival_airport || !departure_time || !arrival_time) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (status && !['Scheduled', 'Boarding', 'Departed', 'Delayed', 'Cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const query = 'INSERT INTO flights (flight_code, airline, departure_airport, arrival_airport, departure_time, arrival_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [flight_code, airline, departure_airport, arrival_airport, departure_time, arrival_time, status || 'Scheduled'], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Flight code already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ flight_id: result.insertId });
    });
});

app.delete('/api/flights/:flight_id', (req, res) => {
    const flight_id = req.params.flight_id;

    // Check for dependent records
    const checkQueries = [
        { table: 'checkins', query: 'SELECT checkin_id FROM checkins WHERE flight_id = ?' },
        { table: 'maintenance', query: 'SELECT maintenance_id FROM maintenance WHERE flight_id = ?' },
        { table: 'notifications', query: 'SELECT notification_id FROM notifications WHERE flight_id = ?' },
        { table: 'baggage', query: 'SELECT baggage_id FROM baggage WHERE flight_id = ?' },
        { table: 'resources', query: 'SELECT resource_id FROM resources WHERE assigned_flight_id = ?' }
    ];

    let dependencyError = null;

    const checkDependencies = (index) => {
        if (index >= checkQueries.length) {
            // No dependencies found, proceed with deletion
            const deleteQuery = 'DELETE FROM flights WHERE flight_id = ?';
            db.query(deleteQuery, [flight_id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Flight not found' });
                }
                res.json({
                    message: 'Flight deleted successfully',
                    affectedRows: result.affectedRows
                });
            });
            return;
        }

        const { table, query } = checkQueries[index];
        db.query(query, [flight_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                dependencyError = `Cannot delete flight because it has associated ${table} records`;
                res.status(400).json({ error: dependencyError });
            } else {
                checkDependencies(index + 1);
            }
        });
    };

    checkDependencies(0);
});

// 3. Gate Assignment
app.put('/api/gates/assign', (req, res) => {
    const { flight_id, gate_id } = req.body;
    if (!flight_id || !gate_id) {
        return res.status(400).json({ error: 'Missing flight_id or gate_id' });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err.message });

        // Check if gate is available
        const checkGateQuery = 'SELECT status FROM gates WHERE gate_id = ?';
        db.query(checkGateQuery, [gate_id], (err, results) => {
            if (err) {
                return db.rollback(() => res.status(500).json({ error: err.message }));
            }
            if (results.length === 0) {
                return db.rollback(() => res.status(404).json({ error: 'Gate not found' }));
            }
            if (results[0].status !== 'Available') {
                return db.rollback(() => res.status(400).json({ error: 'Gate is not available' }));
            }

            // Check if flight exists
            const checkFlightQuery = 'SELECT flight_id FROM flights WHERE flight_id = ?';
            db.query(checkFlightQuery, [flight_id], (err, results) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ error: err.message }));
                }
                if (results.length === 0) {
                    return db.rollback(() => res.status(404).json({ error: 'Flight not found' }));
                }

                // Update flight with gate_id
                const updateFlightQuery = 'UPDATE flights SET gate_id = ? WHERE flight_id = ?';
                db.query(updateFlightQuery, [gate_id, flight_id], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: err.message }));
                    }

                    // Update gate status to Occupied
                    const updateGateQuery = 'UPDATE gates SET status = "Occupied" WHERE gate_id = ?';
                    db.query(updateGateQuery, [gate_id], (err) => {
                        if (err) {
                            return db.rollback(() => res.status(500).json({ error: err.message }));
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => res.status(500).json({ error: err.message }));
                            }
                            res.json({ message: 'Gate assigned successfully' });
                        });
                    });
                });
            });
        });
    });
});

// Update gate status
app.put('/api/gates/:gate_id/status', (req, res) => {
    const { gate_id } = req.params;
    const { status } = req.body;

    if (!['Available', 'Occupied', 'Maintenance'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if gate exists
    const checkGateQuery = 'SELECT gate_id FROM gates WHERE gate_id = ?';
    db.query(checkGateQuery, [gate_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Gate not found' });

        // If setting to Available, ensure no flight is assigned
        if (status === 'Available') {
            const checkFlightQuery = 'SELECT flight_id FROM flights WHERE gate_id = ?';
            db.query(checkFlightQuery, [gate_id], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length > 0) {
                    return res.status(400).json({ error: 'Cannot set gate to Available while assigned to a flight' });
                }

                // Update status
                const updateQuery = 'UPDATE gates SET status = ? WHERE gate_id = ?';
                db.query(updateQuery, [status, gate_id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Gate status updated successfully' });
                });
            });
        } else {
            // Update status directly for Occupied or Maintenance
            const updateQuery = 'UPDATE gates SET status = ? WHERE gate_id = ?';
            db.query(updateQuery, [status, gate_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Gate status updated successfully' });
            });
        }
    });
});

// Free a gate
app.post('/api/gates/free', (req, res) => {
    const { gate_id } = req.body;
    if (!gate_id) {
        return res.status(400).json({ error: 'Missing gate_id' });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err.message });

        // Check if gate exists and is Occupied
        const checkGateQuery = 'SELECT status FROM gates WHERE gate_id = ?';
        db.query(checkGateQuery, [gate_id], (err, results) => {
            if (err) {
                return db.rollback(() => res.status(500).json({ error: err.message }));
            }
            if (results.length === 0) {
                return db.rollback(() => res.status(404).json({ error: 'Gate not found' }));
            }
            if (results[0].status !== 'Occupied') {
                return db.rollback(() => res.status(400).json({ error: 'Gate is not occupied' }));
            }

            // Remove gate assignment from flights
            const updateFlightQuery = 'UPDATE flights SET gate_id = NULL WHERE gate_id = ?';
            db.query(updateFlightQuery, [gate_id], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json({ error: err.message }));
                }

                // Update gate status to Available
                const updateGateQuery = 'UPDATE gates SET status = "Available" WHERE gate_id = ?';
                db.query(updateGateQuery, [gate_id], (err) => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: err.message }));
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => res.status(500).json({ error: err.message }));
                        }
                        res.json({ message: 'Gate freed successfully' });
                    });
                });
            });
        });
    });
});

// Fetch all gates
app.get('/api/gates', (req, res) => {
    const query = 'SELECT * FROM gates';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. Resource Allocation
app.post('/api/resources', (req, res) => {
    const { resource_type, resource_name, status } = req.body;
    if (!resource_type || !resource_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (status && !['Available', 'In Use', 'Maintenance'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const query = 'INSERT INTO resources (resource_type, resource_name, status) VALUES (?, ?, ?)';
    db.query(query, [resource_type, resource_name, status || 'Available'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ resource_id: result.insertId });
    });
});

app.post('/api/resources/assign', (req, res) => {
    const { resource_id, flight_id } = req.body;
    if (!resource_id || !flight_id) {
        return res.status(400).json({ error: 'Missing resource_id or flight_id' });
    }
    const query = 'UPDATE resources SET status = "In Use", assigned_flight_id = ? WHERE resource_id = ? AND status = "Available"';
    db.query(query, [flight_id, resource_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Resource not found or not available' });
        }
        res.json({ message: 'Resource assigned successfully' });
    });
});

app.post('/api/resources/free', (req, res) => {
    const { resource_id } = req.body;
    if (!resource_id) {
        return res.status(400).json({ error: 'Missing resource_id' });
    }
    const query = 'UPDATE resources SET status = "Available", assigned_flight_id = NULL WHERE resource_id = ? AND status = "In Use"';
    db.query(query, [resource_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Resource not found or not in use' });
        }
        res.json({ message: 'Resource freed successfully' });
    });
});

// Fetch all resources
app.get('/api/resources', (req, res) => {
    const query = 'SELECT * FROM resources';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 5. Aircraft Maintenance Scheduling
app.post('/api/maintenance', (req, res) => {
    const { flight_id, maintenance_type, scheduled_date, status } = req.body;
    if (!flight_id || !maintenance_type || !scheduled_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (status && !['Scheduled', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const query = 'INSERT INTO maintenance (flight_id, maintenance_type, scheduled_date, status) VALUES (?, ?, ?, ?)';
    db.query(query, [flight_id, maintenance_type, scheduled_date, status || 'Scheduled'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ maintenance_id: result.insertId });
    });
});

// Fetch all maintenance records
app.get('/api/maintenance', (req, res) => {
    const query = 'SELECT * FROM maintenance';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 6. Real-time Notifications
app.post('/api/notifications', (req, res) => {
    const { flight_id, passenger_id, message, type } = req.body;
    if (!message || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['Delay', 'Cancellation', 'Gate Change', 'General'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }
    const query = 'INSERT INTO notifications (flight_id, passenger_id, message, type) VALUES (?, ?, ?, ?)';
    db.query(query, [flight_id, passenger_id, message, type], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ notification_id: result.insertId });
    });
});

app.get('/api/notifications', (req, res) => {
    const query = 'SELECT * FROM notifications ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 7. Baggage Handling
app.post('/api/baggage', (req, res) => {
    const { passenger_id, flight_id, tag_number, status } = req.body;
    if (!passenger_id || !flight_id || !tag_number || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!['Checked', 'Loaded', 'In Transit', 'Delivered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const query = 'INSERT INTO baggage (passenger_id, flight_id, tag_number, status) VALUES (?, ?, ?, ?)';
    db.query(query, [passenger_id, flight_id, tag_number, status], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tag number already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ baggage_id: result.insertId });
    });
});

app.get('/api/baggage/:tag_number', (req, res) => {
    const query = 'SELECT * FROM baggage WHERE tag_number = ?';
    db.query(query, [req.params.tag_number], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Baggage not found' });
        res.json(results[0]);
    });
});

// Fetch all baggage records
app.get('/api/baggage', (req, res) => {
    const query = 'SELECT * FROM baggage';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});