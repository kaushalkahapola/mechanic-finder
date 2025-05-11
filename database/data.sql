-- Insert Admin User
INSERT INTO Users (id, name, email, password, role, phone, created_at)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Admin User',
  'admin@mechanicfinder.com',
  '$2b$12$4Fk8PvxGzNX0qBxwXkuRZOQ8h0lNxzqvpxh1wkWiMX8PR.eqjH.Iy', -- password: admin123
  'admin',
  '+1234567890',
  NOW()
);

-- Insert Regular User
INSERT INTO Users (id, name, email, password, role, phone, created_at)
VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'John Doe',
  'john@example.com',
  '$2b$12$4Fk8PvxGzNX0qBxwXkuRZOQ8h0lNxzqvpxh1wkWiMX8PR.eqjH.Iy', -- password: user123
  'user',
  '+1234567891',
  NOW()
);

-- Insert Mechanic Users
INSERT INTO Users (id, name, email, password, role, phone, created_at)
VALUES 
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'Mike Mechanic',
  'mike@mechanic.com',
  '$2b$12$4Fk8PvxGzNX0qBxwXkuRZOQ8h0lNxzqvpxh1wkWiMX8PR.eqjH.Iy', -- password: mechanic123
  'mechanic',
  '+1234567892',
  NOW()
),
(
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'Sarah Smith',
  'sarah@mechanic.com',
  '$2b$12$4Fk8PvxGzNX0qBxwXkuRZOQ8h0lNxzqvpxh1wkWiMX8PR.eqjH.Iy', -- password: mechanic123
  'mechanic',
  '+1234567893',
  NOW()
);

-- Insert Service Types
INSERT INTO ServiceTypes (id, name, description, base_price, emergency_surcharge, estimated_duration, created_at)
VALUES
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'Tire Change',
  'Professional tire change service including balancing',
  50.00,
  25.00,
  30,
  NOW()
),
(
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'Oil Change',
  'Complete oil change service with filter replacement',
  40.00,
  20.00,
  45,
  NOW()
),
(
  'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'Battery Replacement',
  'Battery testing and replacement service',
  80.00,
  40.00,
  30,
  NOW()
),
(
  'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'Jump Start',
  'Emergency jump start service',
  30.00,
  15.00,
  15,
  NOW()
),
(
  'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'Towing',
  'Vehicle towing service to nearest garage or specified location',
  100.00,
  50.00,
  60,
  NOW()
);

-- Insert Mechanic Profiles
INSERT INTO Mechanics (id, user_id, availability, rating, certifications, experience_years, service_radius_km, working_hours, is_online, emergency_available)
VALUES
(
  'j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  true,
  4.5,
  '["ASE Master Technician", "BMW Certified"]',
  10,
  20,
  '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":{"start":"09:00","end":"17:00"},"thursday":{"start":"09:00","end":"17:00"},"friday":{"start":"09:00","end":"17:00"}}',
  true,
  true
),
(
  'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  true,
  4.8,
  '["ASE Certified", "Toyota Specialist"]',
  8,
  15,
  '{"monday":{"start":"10:00","end":"18:00"},"tuesday":{"start":"10:00","end":"18:00"},"wednesday":{"start":"10:00","end":"18:00"},"thursday":{"start":"10:00","end":"18:00"},"friday":{"start":"10:00","end":"18:00"},"saturday":{"start":"10:00","end":"14:00"}}',
  true,
  true
);

-- Insert Mechanic Services
INSERT INTO MechanicServices (mechanic_id, service_id, custom_price, is_emergency_available)
VALUES
-- Mike's services
(
  'j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  55.00,
  true
),
(
  'j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
  'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  45.00,
  true
),
(
  'j0eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
  'g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  85.00,
  true
),
-- Sarah's services
(
  'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  52.00,
  true
),
(
  'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
  'h0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  35.00,
  true
),
(
  'k0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
  'i0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  110.00,
  true
); 
