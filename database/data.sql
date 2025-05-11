USE mechanic_finder;

-- Sample Users
INSERT INTO Users (id, name, email, password, role, phone, latitude, longitude)
VALUES
(UUID(), 'Kaushal Kahapola', 'kaushal@example.com', 'hashed_password_1', 'user', '0712345678', 6.9271, 79.8612),
(UUID(), 'John Mechanic', 'johnmech@example.com', 'hashed_password_2', 'mechanic', '0771234567', 6.9330, 79.8500),
(UUID(), 'Admin User', 'admin@example.com', 'hashed_password_admin', 'admin', '0700000000', 6.9100, 79.8700);

-- Fetch user IDs for FK references
SET @user_id_user = (SELECT id FROM Users WHERE email = 'kaushal@example.com');
SET @user_id_mechanic = (SELECT id FROM Users WHERE email = 'johnmech@example.com');

-- Sample Mechanics
INSERT INTO Mechanics (id, user_id, services, availability, rating, certifications, experience_years, latitude, longitude)
VALUES
(UUID(), @user_id_mechanic,
 JSON_ARRAY('Tire Change', 'Oil Change', 'Battery Replacement'),
 TRUE,
 4.5,
 JSON_ARRAY('Certified Mechanic A', 'Workshop Safety License'),
 5,
 6.9330,
 79.8500);

-- Get mechanic_id
SET @mechanic_id = (SELECT id FROM Mechanics WHERE user_id = @user_id_mechanic);

-- Sample Booking
INSERT INTO Bookings (id, user_id, mechanic_id, scheduled_time, service_type, issue_description, status)
VALUES
(UUID(), @user_id_user, @mechanic_id, NOW() + INTERVAL 1 DAY, 'Oil Change', 'Engine oil needs replacement.', 'pending');

-- Sample Review
INSERT INTO Reviews (id, user_id, mechanic_id, rating, comment)
VALUES
(UUID(), @user_id_user, @mechanic_id, 5.0, 'Very professional and quick response.');

-- Sample Notification
INSERT INTO Notifications (id, user_id, message, is_read)
VALUES
(UUID(), @user_id_user, 'Your booking with John Mechanic is confirmed.', FALSE);
