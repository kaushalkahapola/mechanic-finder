export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  licensePlate: string;
  color: string;
  lastService: string;
  image: string;
  vin: string;
  mileage: number;
}

export const vehiclesData: Vehicle[] = [
  // {
  //   id: '1',
  //   make: 'Toyota',
  //   model: 'Camry',
  //   year: 2019,
  //   type: 'Sedan',
  //   licensePlate: 'ABC123',
  //   color: 'Silver',
  //   lastService: '2023-04-15',
  //   image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
  //   vin: '1HGCM82633A123456',
  //   mileage: 45000,
  // },
  // {
  //   id: '2',
  //   make: 'Honda',
  //   model: 'CR-V',
  //   year: 2020,
  //   type: 'SUV',
  //   licensePlate: 'XYZ789',
  //   color: 'Blue',
  //   lastService: '2023-06-22',
  //   image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
  //   vin: '5J6RE4H57BL123456',
  //   mileage: 32000,
  // },
  // {
  //   id: '3',
  //   make: 'Ford',
  //   model: 'F-150',
  //   year: 2018,
  //   type: 'Truck',
  //   licensePlate: 'DEF456',
  //   color: 'Red',
  //   lastService: '2023-02-10',
  //   image: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
  //   vin: '1FTEW1E80JFB12345',
  //   mileage: 58000,
  // },
];
