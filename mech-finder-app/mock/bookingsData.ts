export type BookingStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  mechanicId: string;
  mechanicName: string;
  mechanicImage: string;
  vehicleId: string;
  vehicleName: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  location: string;
  notes: string;
}

export const bookingsData: Booking[] = [
  // {
  //   id: '1',
  //   mechanicId: '1',
  //   mechanicName: 'John Smith',
  //   mechanicImage: 'https://images.pexels.com/photos/8989471/pexels-photo-8989471.jpeg',
  //   vehicleId: '1',
  //   vehicleName: '2019 Toyota Camry',
  //   service: 'Oil Change & Filter',
  //   date: '2023-09-25',
  //   time: '10:00 AM',
  //   status: 'completed',
  //   price: 75,
  //   location: '123 Auto Street, Mechanicsville, CA',
  //   notes: 'Used synthetic oil as requested.',
  // },
  // {
  //   id: '2',
  //   mechanicId: '2',
  //   mechanicName: 'Sarah Johnson',
  //   mechanicImage: 'https://images.pexels.com/photos/8989497/pexels-photo-8989497.jpeg',
  //   vehicleId: '2',
  //   vehicleName: '2020 Honda CR-V',
  //   service: 'Brake Pad Replacement',
  //   date: '2023-10-12',
  //   time: '2:30 PM',
  //   status: 'scheduled',
  //   price: 220,
  //   location: '456 Mechanic Avenue, Autobahn, CA',
  //   notes: 'Front brakes only.',
  // },
  // {
  //   id: '3',
  //   mechanicId: '3',
  //   mechanicName: 'Miguel Rodriguez',
  //   mechanicImage: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg',
  //   vehicleId: '3',
  //   vehicleName: '2018 Ford F-150',
  //   service: 'Engine Tune-Up',
  //   date: '2023-10-05',
  //   time: '9:00 AM',
  //   status: 'in_progress',
  //   price: 350,
  //   location: '789 Wrench Road, Geartown, CA',
  //   notes: 'Check for engine noise during idle.',
  // },
  // {
  //   id: '4',
  //   mechanicId: '4',
  //   mechanicName: 'Emily Chen',
  //   mechanicImage: 'https://images.pexels.com/photos/3807387/pexels-photo-3807387.jpeg',
  //   vehicleId: '1',
  //   vehicleName: '2019 Toyota Camry',
  //   service: 'AC System Recharge',
  //   date: '2023-09-15',
  //   time: '1:00 PM',
  //   status: 'completed',
  //   price: 160,
  //   location: '101 Electric Lane, Futureville, CA',
  //   notes: 'Fixed refrigerant leak and recharged system.',
  // },
  // {
  //   id: '5',
  //   mechanicId: '5',
  //   mechanicName: 'David Williams',
  //   mechanicImage: 'https://images.pexels.com/photos/8989482/pexels-photo-8989482.jpeg',
  //   vehicleId: '2',
  //   vehicleName: '2020 Honda CR-V',
  //   service: 'Diagnostic Scan',
  //   date: '2023-09-20',
  //   time: '11:30 AM',
  //   status: 'cancelled',
  //   price: 90,
  //   location: '222 Vintage Road, Classics, CA',
  //   notes: 'Check engine light investigation.',
  // },
];
