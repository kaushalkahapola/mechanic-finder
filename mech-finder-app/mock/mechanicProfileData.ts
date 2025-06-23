export default {
  id: 'mech-001',
  name: 'John Doe',
  //type: 'user',
  type: 'mechanic',
  specialties: ['Engine Repair', 'Transmission', 'Brakes'],
  certifications: ['ASE Certified', 'Toyota Certified'],
  schedule: [
    { day: 'Monday', startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', startTime: '09:00', endTime: '17:00' },
  ],
  bookings: [
    {
      id: 'booking-001',
      customerName: 'Jane Smith',
      service: 'Oil Change',
      date: '2024-07-01T10:00:00Z',
      status: 'confirmed',
    },
    {
      id: 'booking-002',
      customerName: 'Peter Jones',
      service: 'Brake Inspection',
      date: '2024-07-01T14:00:00Z',
      status: 'pending',
    },
    {
      id: 'booking-003',
      customerName: 'Mary Williams',
      service: 'Engine Diagnostic',
      date: '2024-06-28T11:00:00Z',
      status: 'completed',
    },
  ],
};
