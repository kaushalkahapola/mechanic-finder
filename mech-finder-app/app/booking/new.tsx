import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  Clock,
  Car,
  MessageSquare,
} from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Mechanic } from '@/mock/mechanicsData'; // Keep type
import { Vehicle } from '@/mock/vehiclesData'; // Keep type
import { Booking, BookingStatus } from '@/mock/bookingsData'; // Keep type
import { useData } from '@/context/DataContext'; // Import useData
// Note: A proper DateTimePicker and Select/Picker component would be ideal here.
// For now, using Inputs and simple selection.

export default function NewBookingScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { mechanicId } = useLocalSearchParams<{ mechanicId: string }>();
  const {
    getMechanicById,
    vehicles: userVehicles, // Get vehicles from context
    addBooking: contextAddBooking,
  } = useData();

  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<string | null>(null);
  // Date and Time State
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Formatted date and time strings for display and submission
  const [bookingDate, setBookingDate] = useState(''); // YYYY-MM-DD
  const [bookingTime, setBookingTime] = useState(''); // HH:MM AM/PM

  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Initialize bookingDate and bookingTime when component mounts or date/time changes
    // This ensures they are set even if the user doesn't interact with the pickers
    // but relies on the default current date/time.
    setBookingDate(formatDateToString(date));
    setBookingTime(formatTimeToString(time));
  }, [date, time]); // Update formatted strings if date/time objects change

  useEffect(() => {
    const foundMechanic = getMechanicById(mechanicId || ''); // Use context getter
    if (foundMechanic) {
      setMechanic(foundMechanic);
    } else {
      Alert.alert('Error', 'Mechanic details not found.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
    // Set default vehicle if user has any
    if (userVehicles.length > 0 && !selectedVehicleId) {
      // ensure selectedVehicleId is not already set
      setSelectedVehicleId(userVehicles[0].id);
    }
  }, [mechanicId, userVehicles, getMechanicById, selectedVehicleId]); // Removed date, time from deps for this effect

  const formatDateToString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeToString = (t: Date): string => {
    let hours = t.getHours();
    const minutes = String(t.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS until user dismisses
    if (selectedDate) {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setBookingDate(formatDateToString(currentDate));
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const currentTime = selectedTime || time;
      // Preserve the date part from `date` state, only update time part
      const newDateTime = new Date(date);
      newDateTime.setHours(currentTime.getHours());
      newDateTime.setMinutes(currentTime.getMinutes());
      setTime(newDateTime); // Store the full Date object with updated time
      setBookingTime(formatTimeToString(newDateTime));
    }
  };

  const handleCreateBooking = () => {
    if (
      !mechanic ||
      !selectedVehicleId ||
      !selectedService ||
      !bookingDate ||
      !bookingTime
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all booking details (Vehicle, Service, Date, Time).'
      );
      return;
    }

    const vehicle = userVehicles.find((v) => v.id === selectedVehicleId);
    if (!vehicle) {
      Alert.alert('Error', 'Selected vehicle not found.');
      return;
    }

    const newBookingData: Omit<Booking, 'id'> = {
      mechanicId: mechanic.id,
      mechanicName: mechanic.name,
      mechanicImage: mechanic.profileImage,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      service: selectedService,
      date: bookingDate,
      time: bookingTime,
      status: 'scheduled' as BookingStatus, // Default status
      price: mechanic.hourlyRate, // Placeholder price, could be estimated based on service
      location: mechanic.address,
      notes: notes,
    };
    console.log(
      '[NewBookingScreen] Creating booking with data:',
      newBookingData
    );

    contextAddBooking(newBookingData); // Use context function
    // Note: The ID is generated within contextAddBooking, so we can't log it here directly
    // unless contextAddBooking returns the new booking or its ID.

    Alert.alert(
      'Booking Requested',
      `Your request for ${selectedService} has been sent to ${mechanic.name}.`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)/bookings') }]
    );
  };

  // Basic selector UI (would be a Picker/Dropdown in a full implementation)
  const renderVehicleSelector = () => (
    <View style={styles.selectorContainer}>
      <Text
        style={[
          styles.label,
          typography.subtitle1,
          { color: isDark ? colors.white : colors.gray[700] },
        ]}
      >
        Select Vehicle
      </Text>
      {userVehicles.map(
        (
          v // userVehicles now from context
        ) => (
          <TouchableOpacity
            key={v.id}
            style={[
              styles.selectorOption,
              { borderColor: isDark ? colors.gray[300] : colors.gray[200] },
              selectedVehicleId === v.id && {
                backgroundColor: colors.primary[100],
                borderColor: colors.primary[500],
              },
            ]}
            onPress={() => setSelectedVehicleId(v.id)}
          >
            <Car
              color={
                selectedVehicleId === v.id
                  ? colors.primary[500]
                  : colors.gray[500]
              }
              size={spacing.iconSize.medium}
              style={styles.selectorIcon}
            />
            <Text
              style={[
                typography.body1,
                {
                  color:
                    selectedVehicleId === v.id
                      ? colors.primary[700]
                      : isDark
                      ? colors.white
                      : colors.gray[900],
                },
              ]}
            >
              {v.year} {v.make} {v.model}
            </Text>
          </TouchableOpacity>
        )
      )}
      {userVehicles.length === 0 && (
        <Text style={{ color: colors.gray[500] }}>
          No vehicles found. Please add a vehicle first.
        </Text>
      )}
    </View>
  );

  const renderServiceSelector = () => (
    <View style={styles.selectorContainer}>
      <Text
        style={[
          styles.label,
          typography.subtitle1,
          { color: isDark ? colors.white : colors.gray[700] },
        ]}
      >
        Select Service
      </Text>
      {mechanic?.services.map((s) => (
        <TouchableOpacity
          key={s}
          style={[
            styles.selectorOption,
            { borderColor: isDark ? colors.gray[300] : colors.gray[200] },
            selectedService === s && {
              backgroundColor: colors.primary[100],
              borderColor: colors.primary[500],
            },
          ]}
          onPress={() => setSelectedService(s)}
        >
          <Car
            color={
              selectedService === s ? colors.primary[500] : colors.gray[500]
            }
            size={spacing.iconSize.medium}
            style={styles.selectorIcon}
          />
          <Text
            style={[
              typography.body1,
              {
                color:
                  selectedService === s
                    ? colors.primary[700]
                    : isDark
                    ? colors.white
                    : colors.gray[900],
              },
            ]}
          >
            {s}
          </Text>
        </TouchableOpacity>
      ))}
      {(!mechanic || mechanic.services.length === 0) && (
        <Text style={{ color: colors.gray[500] }}>
          No services listed for this mechanic.
        </Text>
      )}
    </View>
  );

  if (!mechanic) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: isDark ? colors.gray[50] : colors.white,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[typography.body1, { color: colors.gray[500] }]}>
          Loading mechanic details...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.gray[50] : colors.white },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? colors.gray[100] : colors.primary[500],
            borderBottomColor: isDark ? colors.gray[200] : colors.primary[600],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft
            color={isDark ? colors.primary[500] : colors.white}
            size={spacing.iconSize.large}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            typography.h3,
            { color: isDark ? colors.primary[500] : colors.white },
          ]}
        >
          Book Appointment
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.mechanicInfoContainer,
            { borderBottomColor: isDark ? colors.gray[200] : colors.gray[100] },
          ]}
        >
          <Text
            style={[
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            With: {mechanic.name}
          </Text>
          <Text style={[typography.subtitle1, { color: colors.primary[500] }]}>
            Rate: ${mechanic.hourlyRate}/hr (approx)
          </Text>
        </View>

        <View style={styles.formContainer}>
          {renderVehicleSelector()}
          {renderServiceSelector()}

          {/* Date Picker Input */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.inputContainer}
          >
            <Input
              label="Preferred Date"
              value={bookingDate}
              editable={false} // Make it not directly editable
              placeholder="Select a date"
              leftIcon={
                <Calendar
                  color={colors.gray[500]}
                  size={spacing.iconSize.medium}
                />
              }
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              minimumDate={new Date()} // Optional: prevent past dates
            />
          )}

          {/* Time Picker Input */}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.inputContainer}
          >
            <Input
              label="Preferred Time"
              value={bookingTime}
              editable={false} // Make it not directly editable
              placeholder="Select a time"
              leftIcon={
                <Clock
                  color={colors.gray[500]}
                  size={spacing.iconSize.medium}
                />
              }
            />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              testID="timePicker"
              value={time} // Use 'time' state which is a Date object
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onTimeChange}
              is24Hour={false} // Optional: use 12-hour format
            />
          )}

          <Input
            label="Notes for Mechanic (Optional)"
            placeholder="e.g., Specific issues, access instructions"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerStyle={styles.inputContainer}
            leftIcon={
              <MessageSquare
                color={colors.gray[500]}
                size={spacing.iconSize.medium}
              />
            }
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: isDark ? colors.gray[100] : colors.white,
            borderTopColor: isDark ? colors.gray[200] : colors.gray[100],
          },
        ]}
      >
        <Button
          title="Request Booking"
          onPress={handleCreateBooking}
          variant="primary"
          fullWidth
          leftIcon={
            <CheckCircle color={colors.white} size={spacing.iconSize.medium} />
          }
          disabled={
            userVehicles.length === 0 ||
            !mechanic ||
            mechanic.services.length === 0
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Will be set in component style directly
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mechanicInfoContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    // borderBottomColor set dynamically below
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  selectorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectorIcon: {
    marginRight: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    // borderTopColor: '#eee', // Will be set in component style directly
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
