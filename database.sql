-- Create Database
CREATE DATABASE airport_management;
USE airport_management;

-- Create table commands

CREATE TABLE gates (
    gate_id INT AUTO_INCREMENT PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL,
    location VARCHAR(100),
    status ENUM('Available', 'Occupied') DEFAULT 'Available',
    INDEX idx_gate_id (gate_id)
);

CREATE TABLE flights (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_code VARCHAR(10) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    departure_airport VARCHAR(3) NOT NULL,
    arrival_airport VARCHAR(3) NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    status ENUM('Scheduled', 'Boarding', 'Departed', 'Arrived', 'Delayed', 'Cancelled') DEFAULT 'Scheduled',
    gate_id INT,
    FOREIGN KEY (gate_id) REFERENCES gates(gate_id) ON DELETE SET NULL,
    INDEX idx_flight_id (flight_id)
);

CREATE TABLE passengers (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    passport_no VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    INDEX idx_passenger_id (passenger_id)
);

CREATE TABLE checkins (
    checkin_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    checkin_type ENUM('Kiosk', 'Counter', 'Online') NOT NULL,
    baggage_count INT NOT NULL,
    checkin_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    UNIQUE (passenger_id, flight_id)
);

CREATE TABLE resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    resource_type ENUM('Staff', 'Equipment') NOT NULL,
    resource_name VARCHAR(100) NOT NULL,
    status ENUM('Available', 'In Use', 'Maintenance') DEFAULT 'Available',
    assigned_flight_id INT,
    FOREIGN KEY (assigned_flight_id) REFERENCES flights(flight_id) ON DELETE SET NULL
);

CREATE TABLE maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    scheduled_date DATETIME NOT NULL,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT,
    passenger_id INT,
    message TEXT NOT NULL,
    type ENUM('Info', 'Warning', 'Alert') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id),
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id)
);

CREATE TABLE baggage (
    baggage_id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL,
    flight_id INT NOT NULL,
    tag_number VARCHAR(20) NOT NULL,
    status ENUM('Checked', 'Loaded', 'Unloaded', 'Lost') NOT NULL,
    FOREIGN KEY (passenger_id) REFERENCES passengers(passenger_id),
    FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);
