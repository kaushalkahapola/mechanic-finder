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
