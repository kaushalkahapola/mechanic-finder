import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {
  Vehicle,
  vehiclesData as initialVehiclesData,
} from '@/mock/vehiclesData';
import {
  Booking,
  bookingsData as initialBookingsData,
} from '@/mock/bookingsData';
import {
  Mechanic,
  mechanicsData as initialMechanicsData,
} from '@/mock/mechanicsData'; // Mechanics data is mostly static for now

// Define a simple User type
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
}

// Initial User Data (from profile.tsx)
const initialUser: User = {
  id: 'user123',
  name: 'Anushanga Sharada',
  email: 'anushanga@gmail.com',
  phone: '0111234567',
  profileImage:
    'https://ui-avatars.com/api/?name=Anushanga+Sharada?background=0D8ABC&color=fff',
};

interface DataContextType {
  // Vehicles
  vehicles: Vehicle[];
  addVehicle: (
    vehicle: Omit<Vehicle, 'id' | 'lastService' | 'image'> &
      Partial<Pick<Vehicle, 'image'>>
  ) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (vehicleId: string) => void;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getBookingById: (bookingId: string) => Booking | undefined;

  // User
  user: User;
  updateUser: (userData: Partial<User>) => void;

  // Mechanics (mostly static, but good to have in context if needed)
  mechanics: Mechanic[];
  getMechanicById: (mechanicId: string) => Mechanic | undefined;
  updateMechanic: (mechanic: Mechanic) => void;
  updateMechanicServices: (mechanicId: string, services: string[]) => void;
  updateMechanicCertifications: (
    mechanicId: string,
    certifications: string[]
  ) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehiclesData);
  const [bookings, setBookings] = useState<Booking[]>(initialBookingsData);
  const [user, setUser] = useState<User>(initialUser);
  const [mechanics, setMechanics] = useState<Mechanic[]>(initialMechanicsData);

  // Vehicle Functions
  const addVehicle = (
    vehicleData: Omit<Vehicle, 'id' | 'lastService' | 'image'> &
      Partial<Pick<Vehicle, 'image'>>
  ) => {
    const newVehicle: Vehicle = {
      id: String(Date.now()),
      ...vehicleData,
      year: Number(vehicleData.year) || new Date().getFullYear(),
      mileage: Number(vehicleData.mileage) || 0,
      lastService: new Date().toISOString().split('T')[0], // Default to today
      image:
        vehicleData.image ||
        `https://ui-avatars.com/api/?name=${vehicleData.make}?background=0D8ABC&color=fff`,
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  const deleteVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  };

  const getVehicleById = (vehicleId: string) =>
    vehicles.find((v) => v.id === vehicleId);

  // Booking Functions
  const addBooking = (bookingData: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      id: String(Date.now()), // Consider a more robust ID generation for production
      ...bookingData,
    };
    console.log('[DataContext] Adding booking:', newBooking);
    setBookings((prev) => {
      const updatedBookings = [...prev, newBooking];
      console.log('[DataContext] Bookings after add:', updatedBookings);
      return updatedBookings;
    });
  };

  const updateMechanic = (updatedMechanic: Mechanic) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === updatedMechanic.id ? updatedMechanic : m))
    );
  };

  const updateMechanicServices = (mechanicId: string, services: string[]) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === mechanicId ? { ...m, services } : m))
    );
  };

  const updateMechanicCertifications = (
    mechanicId: string,
    certifications: string[]
  ) => {
    setMechanics((prev) =>
      prev.map((m) => (m.id === mechanicId ? { ...m, certifications } : m))
    );
  };

  const updateBookingStatus = (
    bookingId: string,
    status: Booking['status']
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  const getBookingById = (bookingId: string) => {
    console.log(`[DataContext] Attempting to get booking by ID: ${bookingId}`);
    const booking = bookings.find((b) => b.id === bookingId);
    console.log('[DataContext] Booking found:', booking);
    return booking;
  };

  // User Functions
  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  // Mechanic Functions
  const getMechanicById = (mechanicId: string) =>
    mechanics.find((m) => m.id === mechanicId);

  return (
    <DataContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        getVehicleById,
        bookings,
        addBooking,
        updateBookingStatus,
        getBookingById,
        user,
        updateUser,
        mechanics,
        getMechanicById,
        updateMechanic,
        updateMechanicServices,
        updateMechanicCertifications,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
