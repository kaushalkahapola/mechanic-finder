// Sample data for testing the Mechanic Finder app
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sampleUsers = [
    {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '1234567890',
        password: 'password123',
        userType: 'mechanic',
        createdAt: '2024-01-01T00:00:00.000Z',
        location: 'New York, NY',
        experience: '8 years',
        hourlyRate: '$65/hour',
        skills: ['Engine Repair', 'Transmission', 'Electrical Systems', 'Brake Systems', 'Diagnostics'],
        certifications: ['ASE Certified', 'BMW Certified', 'Toyota Certified'],
        rating: 4.8,
        totalReviews: 24,
        isAvailable: true,
    },
    {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '2345678901',
        password: 'password123',
        userType: 'mechanic',
        createdAt: '2024-01-02T00:00:00.000Z',
        location: 'Los Angeles, CA',
        experience: '5 years',
        hourlyRate: '$55/hour',
        skills: ['Oil Changes', 'Tire Services', 'Basic Repairs', 'AC Systems'],
        certifications: ['ASE Certified', 'Honda Certified'],
        rating: 4.6,
        totalReviews: 18,
        isAvailable: true,
    },
    {
        id: '3',
        name: 'Mike Wilson',
        email: 'mike@example.com',
        phone: '3456789012',
        password: 'password123',
        userType: 'vehicle_owner',
        createdAt: '2024-01-03T00:00:00.000Z',
    },
    {
        id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '4567890123',
        password: 'password123',
        userType: 'vehicle_owner',
        createdAt: '2024-01-04T00:00:00.000Z',
    },
];

export const sampleRepairRequests = [
    {
        id: '1',
        customerName: 'Mike Wilson',
        customerPhone: '3456789012',
        vehicleInfo: '2018 Honda Civic - Engine making knocking sound',
        issue: 'Engine is making a loud knocking sound when accelerating. The sound gets worse at higher speeds.',
        location: 'Downtown New York, NY',
        urgency: 'high',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00.000Z',
        additionalNotes: 'Car is still drivable but I\'m worried about engine damage.',
    },
    {
        id: '2',
        customerName: 'Emily Davis',
        customerPhone: '4567890123',
        vehicleInfo: '2020 Toyota Camry - Brake pedal feels soft',
        issue: 'Brake pedal feels soft and goes almost to the floor. Braking power is reduced.',
        location: 'Midtown Manhattan, NY',
        urgency: 'high',
        status: 'accepted',
        createdAt: '2024-01-14T14:20:00.000Z',
        additionalNotes: 'This is my daily driver and I need it fixed asap.',
    },
    {
        id: '3',
        customerName: 'Mike Wilson',
        customerPhone: '3456789012',
        vehicleInfo: '2018 Honda Civic - AC not working',
        issue: 'Air conditioning is not cooling. Only hot air comes out of the vents.',
        location: 'Brooklyn, NY',
        urgency: 'medium',
        status: 'completed',
        createdAt: '2024-01-10T09:15:00.000Z',
        additionalNotes: 'Perfect timing for summer!',
    },
    {
        id: '4',
        customerName: 'Emily Davis',
        customerPhone: '4567890123',
        vehicleInfo: '2020 Toyota Camry - Oil change needed',
        issue: 'Oil change light is on. Need routine maintenance.',
        location: 'Queens, NY',
        urgency: 'low',
        status: 'declined',
        createdAt: '2024-01-12T16:45:00.000Z',
        additionalNotes: 'Not urgent, can wait a few days.',
    },
];

export const sampleReviews = [
    {
        id: '1',
        customerName: 'Mike Wilson',
        rating: 5,
        comment: 'John did an excellent job fixing my engine issue. Very professional and knowledgeable. Highly recommend!',
        date: '2024-01-13T00:00:00.000Z',
    },
    {
        id: '2',
        customerName: 'Emily Davis',
        rating: 4,
        comment: 'Good service, fixed my brake issue quickly. Would use again.',
        date: '2024-01-12T00:00:00.000Z',
    },
    {
        id: '3',
        customerName: 'Alex Thompson',
        rating: 5,
        comment: 'Outstanding work! John diagnosed and fixed my transmission problem in no time. Very fair pricing too.',
        date: '2024-01-11T00:00:00.000Z',
    },
    {
        id: '4',
        customerName: 'Lisa Chen',
        rating: 4,
        comment: 'Sarah was very helpful with my AC repair. Good communication throughout the process.',
        date: '2024-01-10T00:00:00.000Z',
    },
    {
        id: '5',
        customerName: 'David Rodriguez',
        rating: 5,
        comment: 'Excellent service! Fixed my electrical issue that other mechanics couldn\'t figure out.',
        date: '2024-01-09T00:00:00.000Z',
    },
];

export const sampleNotifications = [
    {
        id: '1',
        userId: 'Mike Wilson',
        title: 'Request Accepted',
        message: 'Your repair request for 2018 Honda Civic has been accepted by John Smith',
        type: 'success',
        createdAt: '2024-01-15T11:00:00.000Z',
        read: false,
    },
    {
        id: '2',
        userId: 'Emily Davis',
        title: 'Request Completed',
        message: 'Your brake repair for 2020 Toyota Camry has been completed by John Smith',
        type: 'success',
        createdAt: '2024-01-14T16:30:00.000Z',
        read: true,
    },
    {
        id: '3',
        userId: 'Emily Davis',
        title: 'Request Declined',
        message: 'Your oil change request for 2020 Toyota Camry has been declined by Sarah Johnson',
        type: 'info',
        createdAt: '2024-01-12T17:00:00.000Z',
        read: false,
    },
];

// Function to initialize sample data
export const initializeSampleData = async () => {
    try {
        // Check if data already exists
        const existingUsers = await AsyncStorage.getItem('users');
        if (!existingUsers) {
            await AsyncStorage.setItem('users', JSON.stringify(sampleUsers));
        }

        const existingRequests = await AsyncStorage.getItem('repairRequests');
        if (!existingRequests) {
            await AsyncStorage.setItem('repairRequests', JSON.stringify(sampleRepairRequests));
        }

        const existingReviews = await AsyncStorage.getItem('mechanicReviews');
        if (!existingReviews) {
            await AsyncStorage.setItem('mechanicReviews', JSON.stringify(sampleReviews));
        }

        const existingNotifications = await AsyncStorage.getItem('notifications');
        if (!existingNotifications) {
            await AsyncStorage.setItem('notifications', JSON.stringify(sampleNotifications));
        }

        console.log('Sample data initialized successfully');
    } catch (error) {
        console.error('Error initializing sample data:', error);
    }
}; 