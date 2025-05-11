DROP DATABASE IF EXISTS mechanic_finder;
CREATE DATABASE mechanic_finder;
USE mechanic_finder;

-- Users Table
CREATE TABLE Users (
    id CHAR(36) PRIMARY KEY,  -- UUID format
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'mechanic', 'admin') NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Refresh Tokens Table
CREATE TABLE RefreshTokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Mechanics Table
CREATE TABLE Mechanics (
    id CHAR(36) PRIMARY KEY,  -- UUID format
    user_id CHAR(36) NOT NULL,  -- FK to Users
    services JSON,
    availability BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 0,
    certifications JSON,
    experience_years INT,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    last_location_update TIMESTAMP,
    service_radius_km DECIMAL(5, 2) DEFAULT 10.00,  -- Default 10km radius
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Bookings (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    mechanic_id CHAR(36) NOT NULL,
    service_location_latitude DECIMAL(10, 8) NOT NULL,
    service_location_longitude DECIMAL(11, 8) NOT NULL,
    scheduled_time DATETIME NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    issue_description TEXT,
    estimated_duration INT NOT NULL,
    actual_duration INT,
    estimated_cost DECIMAL(10, 2) NOT NULL,
    final_cost DECIMAL(10, 2),
    status ENUM('pending', 'accepted', 'completed', 'canceled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    cancellation_reason TEXT,
    completion_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id),
    INDEX idx_status (status),
    INDEX idx_user_status (user_id, status),
    INDEX idx_mechanic_status (mechanic_id, status),
    INDEX idx_scheduled_time (scheduled_time)
);

-- Reviews Table
CREATE TABLE Reviews (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    mechanic_id CHAR(36) NOT NULL,
    rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id)
);

-- Notifications Table
CREATE TABLE Notifications (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- User Audit Table
CREATE TABLE UserAudit (
    audit_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Mechanic Audit Table
CREATE TABLE MechanicAudit (
    audit_id CHAR(36) PRIMARY KEY,
    mechanic_id CHAR(36) NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id)
);

-- Booking Audit Table
CREATE TABLE BookingAudit (
    audit_id CHAR(36) PRIMARY KEY,
    booking_id CHAR(36) NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id)
);

-- Review Audit Table
CREATE TABLE ReviewAudit (
    audit_id CHAR(36) PRIMARY KEY,
    review_id CHAR(36) NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES Reviews(id)
);

-- TRIGGERS
DELIMITER //

CREATE TRIGGER after_user_update
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
    INSERT INTO UserAudit (audit_id, user_id, action, old_data, new_data)
    VALUES (UUID(), OLD.id, 'UPDATE',
            JSON_OBJECT('name', OLD.name, 'email', OLD.email),
            JSON_OBJECT('name', NEW.name, 'email', NEW.email));
END//

CREATE TRIGGER after_mechanic_update
AFTER UPDATE ON Mechanics
FOR EACH ROW
BEGIN
    INSERT INTO MechanicAudit (audit_id, mechanic_id, action, old_data, new_data)
    VALUES (UUID(), OLD.id, 'UPDATE',
            JSON_OBJECT('services', OLD.services, 'rating', OLD.rating),
            JSON_OBJECT('services', NEW.services, 'rating', NEW.rating));
END//

CREATE TRIGGER after_booking_update
AFTER UPDATE ON Bookings
FOR EACH ROW
BEGIN
    INSERT INTO BookingAudit (audit_id, booking_id, action, old_data, new_data)
    VALUES (UUID(), OLD.id, 'UPDATE',
            JSON_OBJECT('status', OLD.status),
            JSON_OBJECT('status', NEW.status));
END//

CREATE TRIGGER after_review_update
AFTER UPDATE ON Reviews
FOR EACH ROW
BEGIN
    INSERT INTO ReviewAudit (audit_id, review_id, action, old_data, new_data)
    VALUES (UUID(), OLD.id, 'UPDATE',
            JSON_OBJECT('rating', OLD.rating, 'comment', OLD.comment),
            JSON_OBJECT('rating', NEW.rating, 'comment', NEW.comment));
END//

-- STORED PROCEDURES

CREATE PROCEDURE CreateBooking(
    IN p_user_id CHAR(36),
    IN p_mechanic_id CHAR(36),
    IN p_service_type VARCHAR(255),
    IN p_scheduled_time DATETIME,
    IN p_issue_description TEXT
)
BEGIN
    INSERT INTO Bookings (id, user_id, mechanic_id, service_type, scheduled_time, issue_description)
    VALUES (UUID(), p_user_id, p_mechanic_id, p_service_type, p_scheduled_time, p_issue_description);
END//

CREATE PROCEDURE UpdateMechanicAvailability(
    IN p_mechanic_id CHAR(36),
    IN p_availability BOOLEAN
)
BEGIN
    UPDATE Mechanics SET availability = p_availability WHERE id = p_mechanic_id;
END//

DELIMITER ;

-- VIEW for available mechanics
CREATE VIEW AvailableMechanics AS
SELECT
    m.id AS mechanic_id,
    m.user_id,
    u.name,
    m.services,
    m.rating,
    m.current_latitude,
    m.current_longitude
FROM Mechanics m
JOIN Users u ON m.user_id = u.id
WHERE m.availability = TRUE;

-- INDEXES
CREATE INDEX idx_user_email ON Users(email);
CREATE INDEX idx_booking_user_id ON Bookings(user_id);
CREATE INDEX idx_review_mechanic_id ON Reviews(mechanic_id);

-- new alters and tables (need to change)
-- Add to Mechanics table
ALTER TABLE Mechanics ADD COLUMN working_hours JSON;
ALTER TABLE Mechanics ADD COLUMN is_online BOOLEAN DEFAULT FALSE;
ALTER TABLE Mechanics ADD COLUMN last_online TIMESTAMP;
ALTER TABLE Mechanics ADD COLUMN emergency_available BOOLEAN DEFAULT FALSE;

-- Track location history
CREATE TABLE MechanicLocationHistory (
    id CHAR(36) PRIMARY KEY,
    mechanic_id CHAR(36) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id)
);

CREATE TABLE ServiceTypes (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2),
    emergency_surcharge DECIMAL(10, 2),
    estimated_duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE MechanicServices (
    mechanic_id CHAR(36),
    service_id CHAR(36),
    custom_price DECIMAL(10, 2),
    is_emergency_available BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (mechanic_id, service_id),
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id),
    FOREIGN KEY (service_id) REFERENCES ServiceTypes(id)
);

CREATE TABLE ServiceTypes (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2),
    emergency_surcharge DECIMAL(10, 2),
    estimated_duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE MechanicServices (
    mechanic_id CHAR(36),
    service_id CHAR(36),
    custom_price DECIMAL(10, 2),
    is_emergency_available BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (mechanic_id, service_id),
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id),
    FOREIGN KEY (service_id) REFERENCES ServiceTypes(id)
);

-- Add to Bookings table
ALTER TABLE Bookings 
    ADD COLUMN is_emergency BOOLEAN DEFAULT FALSE,
    ADD COLUMN emergency_description TEXT,
    ADD COLUMN response_time INT,
    ADD COLUMN emergency_contact VARCHAR(255);

-- Emergency Contact Information
CREATE TABLE EmergencyContacts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Transactions (
    id CHAR(36) PRIMARY KEY,
    booking_id CHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Bookings(id)
);

CREATE TABLE TransactionHistory (
    id CHAR(36) PRIMARY KEY,
    transaction_id CHAR(36) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded'),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES Transactions(id)
);

CREATE TABLE ServiceStatistics (
    id CHAR(36) PRIMARY KEY,
    mechanic_id CHAR(36),
    service_type_id CHAR(36),
    total_bookings INT DEFAULT 0,
    completed_bookings INT DEFAULT 0,
    canceled_bookings INT DEFAULT 0,
    average_response_time INT,
    average_rating DECIMAL(3,2),
    total_revenue DECIMAL(10,2),
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES Mechanics(id),
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(id)
);

CREATE TABLE AreaStatistics (
    id CHAR(36) PRIMARY KEY,
    area_latitude DECIMAL(10, 8),
    area_longitude DECIMAL(11, 8),
    radius_km INT,
    total_requests INT DEFAULT 0,
    total_completed INT DEFAULT 0,
    average_response_time INT,
    peak_hours JSON,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
