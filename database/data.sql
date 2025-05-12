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

-- Insert Subscription Plans
INSERT INTO SubscriptionPlans (
    id,
    name,
    description,
    price,
    duration_months,
    service_intervals,
    features,
    mechanic_revenue_share,
    created_at
)
VALUES
(
    'sp-basic-001',
    'Basic Maintenance Plan',
    'Essential maintenance coverage including oil changes and basic inspections',
    29.99,
    1,
    JSON_OBJECT(
        'oil_change', 3,
        'inspection', 6,
        'tire_rotation', 6
    ),
    JSON_ARRAY(
        'Monthly basic inspection',
        'Quarterly oil change',
        'Priority booking',
        'Maintenance reminders'
    ),
    70.00,
    NOW()
),
(
    'sp-premium-001',
    'Premium Maintenance Plan',
    'Comprehensive maintenance coverage with priority service and additional benefits',
    49.99,
    1,
    JSON_OBJECT(
        'oil_change', 3,
        'inspection', 3,
        'tire_rotation', 4,
        'brake_inspection', 6,
        'battery_check', 6
    ),
    JSON_ARRAY(
        'Monthly comprehensive inspection',
        'Quarterly oil change',
        'Bi-annual brake service',
        'Priority emergency service',
        '24/7 phone support',
        'Maintenance reminders',
        'Detailed service history tracking'
    ),
    75.00,
    NOW()
),
(
    'sp-annual-001',
    'Annual Service Plan',
    'Annual maintenance package with significant savings',
    299.99,
    12,
    JSON_OBJECT(
        'oil_change', 3,
        'inspection', 3,
        'tire_rotation', 4,
        'brake_inspection', 6,
        'battery_check', 6,
        'full_inspection', 12
    ),
    JSON_ARRAY(
        'All Premium Plan features',
        'Annual full vehicle inspection',
        'Free tire rotations',
        'Discounted emergency services',
        'Dedicated mechanic assignment',
        'Vehicle health reports'
    ),
    80.00,
    NOW()
);
