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
    'Basic Care Plan',
    'Essential vehicle maintenance package for regular upkeep',
    2999.00,  -- LKR 2,999 per month
    1,
    JSON_OBJECT(
        'oil_change', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'basic_inspection', JSON_OBJECT(
            'interval_months', 1,
            'included_services', 12
        ),
        'tire_rotation', JSON_OBJECT(
            'interval_months', 6,
            'included_services', 2
        )
    ),
    JSON_ARRAY(
        'Monthly basic inspection',
        'Quarterly oil change',
        'Semi-annual tire rotation',
        'Basic maintenance reminders',
        'Access to mechanic network',
        'Flexible scheduling'
    ),
    70.00,
    NOW()
),
(
    'sp-premium-001',
    'Premium Care Plan',
    'Comprehensive maintenance package with priority service',
    4999.00,  -- LKR 4,999 per month
    1,
    JSON_OBJECT(
        'oil_change', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'full_inspection', JSON_OBJECT(
            'interval_months', 1,
            'included_services', 12
        ),
        'tire_service', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'brake_inspection', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'battery_check', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        )
    ),
    JSON_ARRAY(
        'All Basic Plan features',
        'Priority scheduling',
        'Quarterly brake inspection',
        'Quarterly battery check',
        '24/7 emergency support',
        'Detailed service history',
        'Advanced maintenance predictions',
        'Preferred mechanic selection'
    ),
    75.00,
    NOW()
),
(
    'sp-annual-001',
    'Annual Protection Plan',
    'Complete annual maintenance solution with maximum savings',
    49999.00,  -- LKR 49,999 per year
    12,
    JSON_OBJECT(
        'oil_change', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'full_inspection', JSON_OBJECT(
            'interval_months', 1,
            'included_services', 12
        ),
        'tire_service', JSON_OBJECT(
            'interval_months', 2,
            'included_services', 6
        ),
        'brake_service', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'battery_service', JSON_OBJECT(
            'interval_months', 3,
            'included_services', 4
        ),
        'ac_service', JSON_OBJECT(
            'interval_months', 6,
            'included_services', 2
        )
    ),
    JSON_ARRAY(
        'All Premium Plan features',
        'Annual deep inspection',
        'Bi-monthly tire service',
        'AC system maintenance',
        'VIP emergency response',
        'Dedicated mechanic team',
        'Custom maintenance schedule',
        'Full service history reports',
        'Family vehicle coverage*'
    ),
    80.00,
    NOW()
);
