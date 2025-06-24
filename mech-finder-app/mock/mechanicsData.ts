export interface Mechanic {
  id: string;
  name: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  distance: number;
  services: string[];
  certifications: string[];
  address: string;
  hourlyRate: number;
  latitude: number;
  longitude: number;
  about: string;
  phoneNumber: string;
  email: string;
  availability: {
    days: string[];
    hours: string;
  };
}

export const mechanicsData: Mechanic[] = [
  {
    id: '1',
    name: 'John Smith',
    profileImage:
      'https://images.pexels.com/photos/8989471/pexels-photo-8989471.jpeg',
    rating: 4.8,
    reviewCount: 124,
    distance: 1.2,
    services: [
      'Engine Repair',
      'Transmission',
      'Brakes',
      'Electrical',
      'Fuel Delivery',
      'Flat Tyre Assistance',
    ],
    certifications: ['ASE Master Technician', 'BMW Certified'],
    address: '123 Galle Road, Colombo 03, Sri Lanka',
    hourlyRate: 85,
    latitude: 6.9271,
    longitude: 79.8612,
    about:
      'With over 15 years of experience, I specialize in European cars and offer quality service at competitive rates. Same-day service available for most repairs.',
    phoneNumber: '(555) 123-4567',
    email: 'john.smith@example.com',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '8:00 AM - 6:00 PM',
    },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    profileImage:
      'https://images.pexels.com/photos/8989497/pexels-photo-8989497.jpeg',
    rating: 4.9,
    reviewCount: 98,
    distance: 2.5,
    services: [
      'Oil Change',
      'Tune-up',
      'AC Repair',
      'Diagnostics',
      'Battery Jump-Start',
      'Fuel Delivery',
    ],
    certifications: ['ASE Certified', 'Honda Specialist'],
    address: '456 Marine Drive, Colombo 04, Sri Lanka',
    hourlyRate: 75,
    latitude: 6.9275,
    longitude: 79.8625,
    about:
      'Female mechanic with 10+ years of experience. I pride myself on honest diagnostics and transparent pricing. Specializing in Japanese imports.',
    phoneNumber: '(555) 234-5678',
    email: 'sarah.johnson@example.com',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '9:00 AM - 5:00 PM',
    },
  },
  {
    id: '3',
    name: 'Miguel Rodriguez',
    profileImage:
      'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg',
    rating: 4.7,
    reviewCount: 156,
    distance: 3.1,
    services: [
      'Engine Overhaul',
      'Suspension',
      'Steering',
      'Exhaust',
      'Flat Tyre Assistance',
      'Battery Replacement',
    ],
    certifications: ['ASE Master Technician', 'Toyota Certified'],
    address: '789 Flower Road, Colombo 07, Sri Lanka',
    hourlyRate: 90,
    latitude: 6.9279,
    longitude: 79.864,
    about:
      'Expert mechanic with 20+ years in the industry. Specialized in performance tuning and engine rebuilds. All work comes with a 2-year warranty.',
    phoneNumber: '(555) 345-6789',
    email: 'miguel.rodriguez@example.com',
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '7:00 AM - 7:00 PM',
    },
  },
  {
    id: '4',
    name: 'Emily Chen',
    profileImage:
      'https://images.pexels.com/photos/3807387/pexels-photo-3807387.jpeg',
    rating: 4.6,
    reviewCount: 87,
    distance: 0.8,
    services: ['Hybrid Repair', 'Electric Vehicles', 'Computer Diagnostics'],
    certifications: ['EV Specialist', 'Tesla Certified'],
    address: '101 Park Street, Colombo 05, Sri Lanka',
    hourlyRate: 110,
    latitude: 6.9283,
    longitude: 79.8655,
    about:
      'Specialized in electric and hybrid vehicles. Factory-trained for Tesla, Nissan Leaf, and Chevy Bolt. Latest diagnostic equipment for all EV systems.',
    phoneNumber: '(555) 456-7890',
    email: 'emily.chen@example.com',
    availability: {
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '10:00 AM - 6:00 PM',
    },
  },
  {
    id: '5',
    name: 'Mechanic 1',
    profileImage:
      'https://images.pexels.com/photos/8989482/pexels-photo-8989482.jpeg',
    rating: 0,
    reviewCount: 0,
    distance: 4.7,
    services: ['Engine Repair', 'Transmission', 'Brakes'],
    certifications: ['ASE Certified', 'Toyota Certified'],
    address: '222 Independence Square, Colombo 01, Sri Lanka',
    hourlyRate: 95,
    latitude: 6.929,
    longitude: 79.86,
    about:
      'Classic car enthusiast and professional restorer. Over 25 years working with vintage American and European automobiles. Concours-quality work.',
    phoneNumber: '0717539478',
    email: 'david.williams@example.com',
    availability: {
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
      hours: '9:00 AM - 6:00 PM',
    },
  },
];
