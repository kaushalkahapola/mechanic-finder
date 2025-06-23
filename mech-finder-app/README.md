# Mechanic Finder App

A React Native mobile application that connects vehicle owners with mechanics for repair services.

## Features

### Authentication System
- **Unified Sign-in Page**: Single page for both login and registration
- **User Type Selection**: Choose between "Vehicle Owner" or "Mechanic" during registration
- **Local Storage**: User data stored locally using AsyncStorage (no backend required)
- **Role-Based Routing**: Different dashboards for mechanics and vehicle owners

### Vehicle Owner Features
- **Vehicle Owner Dashboard**: Dedicated dashboard with overview, requests, notifications, and profile tabs
- **Submit Repair Requests**: Create detailed repair requests with vehicle information, issue description, and urgency levels
- **Request Status Tracking**: View the status of submitted requests (pending, accepted, declined, completed)
- **Notifications**: Receive real-time updates about request status changes
- **Find Mechanics**: Access to the mechanic finder functionality to browse available mechanics
- **Contact Mechanics**: Get mechanic contact information for accepted requests

### Mechanic Dashboard
- **Overview Tab**: 
  - Statistics dashboard showing pending requests, completed jobs, and average rating
  - Profile summary with skills, experience, and availability status
- **Requests Tab**: 
  - View all incoming repair requests
  - Accept or decline requests with one-click actions
  - See request details including urgency levels and customer information
- **Reviews Tab**: 
  - View customer reviews and ratings
  - Track overall rating and total number of reviews
- **Profile Tab**: 
  - Manage personal information
  - Add/edit skills and certifications
  - Update availability status
  - Logout functionality

### Notification System
- **Real-time Updates**: Instant notifications when mechanics accept/decline requests
- **Status Tracking**: Clear indication of read/unread notifications
- **Time Stamps**: Shows when notifications were received
- **Delete Options**: Individual and bulk notification deletion

## Sample Data

The app comes with pre-loaded sample data for testing:

### Sample Users
- **John Smith** (Mechanic): john@example.com / password123
- **Sarah Johnson** (Mechanic): sarah@example.com / password123
- **Mike Wilson** (Vehicle Owner): mike@example.com / password123
- **Emily Davis** (Vehicle Owner): emily@example.com / password123

### Sample Repair Requests
- Various repair requests with different urgency levels and statuses
- Realistic vehicle issues and descriptions
- Different locations and customer information

### Sample Reviews
- Customer reviews for mechanics
- Various ratings and detailed comments
- Realistic feedback scenarios

## How to Use

### For Vehicle Owners
1. **Register/Login**: Use the sign-in page to create an account or login
2. **Dashboard Access**: Access your dedicated vehicle owner dashboard
3. **Submit Request**: Use the "New Request" quick action or navigate to the requests tab
4. **Fill Details**: Provide vehicle information, issue description, location, and urgency
5. **Find Mechanics**: Use the "Find Mechanics" quick action to browse available mechanics
6. **Track Status**: Check notifications for updates on your request
7. **Contact Mechanic**: Once accepted, contact the mechanic using provided information

### For Mechanics
1. **Register/Login**: Create a mechanic account or login
2. **Dashboard Access**: View the comprehensive mechanic dashboard
3. **Review Requests**: Check incoming repair requests in the Requests tab
4. **Accept/Decline**: Take action on requests with accept/decline buttons
5. **Manage Profile**: Update skills, certifications, and availability
6. **View Reviews**: Check customer feedback and ratings

## Technical Details

### Tech Stack
- **React Native** with Expo
- **TypeScript** for type safety
- **Expo Router** for navigation
- **AsyncStorage** for local data persistence
- **Formik & Yup** for form handling and validation
- **Lucide React Native** for icons
- **Custom Theme System** with dark/light mode support

### Data Storage
- All data is stored locally using AsyncStorage
- No backend server required
- Data persists between app sessions
- Sample data is automatically initialized on first launch

### Navigation Flow
```
App Launch → Authentication Check → Sign-in Page
                                    ↓
Vehicle Owner → Vehicle Owner Dashboard → Request Repair → Submit Request
                                    ↓
Mechanic → Mechanic Dashboard → Manage Requests → Accept/Decline
                                    ↓
Notifications → Status Updates → Contact Information
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Run on Device/Simulator**:
   - Use Expo Go app on your device
   - Or run on iOS/Android simulator

4. **Test the App**:
   - Use the sample credentials provided above
   - Try both vehicle owner and mechanic flows
   - Test the notification system

## File Structure

```
app/
├── auth/
│   └── signin.tsx          # Main authentication page
├── mechanic/
│   └── dashboard.tsx       # Mechanic dashboard
├── vehicle/
│   ├── dashboard.tsx       # Vehicle owner dashboard
│   └── request-repair.tsx  # Repair request form
├── (tabs)/
│   └── index.tsx          # Mechanic finder (for vehicle owners)
├── notifications.tsx       # Notifications page
└── _layout.tsx            # App layout and routing
mock/
└── sampleData.ts          # Sample data for testing
components/
└── ui/                    # Reusable UI components
theme/
├── ThemeProvider.tsx      # Theme context
├── colors.ts             # Color definitions
├── spacing.ts            # Spacing system
└── typography.ts         # Typography system
```

## Future Enhancements

- Backend integration with real database
- Push notifications
- Payment processing
- Real-time chat between users and mechanics
- GPS location services
- Photo/video upload for vehicle issues
- Appointment scheduling system
- Mechanic search and filtering
- Rating and review system for both parties 