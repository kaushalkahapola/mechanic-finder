import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  MapPin,
  FileText,
  DollarSign,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react-native';
import { Booking, BookingStatus } from '@/mock/bookingsData';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';

const getStatusStyle = (status: BookingStatus, colors: any) => {
  switch (status) {
    case 'scheduled':
      return {
        text: 'Scheduled',
        color: colors.primary[500],
        icon: <Calendar color={colors.primary[500]} size={18} />,
        backgroundColor: colors.primary[100],
      };
    case 'in_progress':
      return {
        text: 'In Progress',
        color: colors.warning[600],
        icon: <Clock color={colors.warning[600]} size={18} />,
        backgroundColor: colors.warning[100],
      };
    case 'completed':
      return {
        text: 'Completed',
        color: colors.success[500],
        icon: <CheckCircle color={colors.success[500]} size={18} />,
        backgroundColor: colors.success[100],
      };
    case 'cancelled':
      return {
        text: 'Cancelled',
        color: colors.error[500],
        icon: <XCircle color={colors.error[500]} size={18} />,
        backgroundColor: colors.error[100],
      };
    default:
      return {
        text: (status as string).toUpperCase(),
        color: colors.gray[700],
        icon: <AlertTriangle color={colors.gray[700]} size={18} />,
        backgroundColor: colors.gray[200],
      };
  }
};

export default function BookingDetailScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getBookingById, updateBookingStatus: contextUpdateBookingStatus } =
    useData();

  const [booking, setBooking] = useState<Booking | undefined>(undefined);

  useEffect(() => {
    if (id) {
      const freshBooking = getBookingById(id);
      setBooking(freshBooking);
    }
  }, [id, getBookingById]);

  const handleCancelBooking = () => {
    if (!booking || !id) return;

    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel this booking for ${booking.service} on ${booking.date}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            contextUpdateBookingStatus(id, 'cancelled');
            setBooking((prev) =>
              prev ? { ...prev, status: 'cancelled' } : undefined
            );
            Alert.alert(
              'Booking Cancelled',
              `Your booking for ${booking.service} has been cancelled.`,
              [{ text: 'OK', onPress: () => router.back() }]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!id) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text
          style={[
            typography.h3,
            {
              color: isDark ? colors.white : colors.gray[900],
              textAlign: 'center',
              marginBottom: spacing.md,
            },
          ]}
        >
          Invalid Booking ID
        </Text>
        <Button
          title="Go to My Bookings"
          onPress={() => router.replace('/(tabs)/bookings')}
        />
      </SafeAreaView>
    );
  }

  if (booking === undefined) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text
          style={[
            typography.h3,
            {
              color: isDark ? colors.white : colors.gray[900],
              textAlign: 'center',
              marginBottom: spacing.md,
            },
          ]}
        >
          Loading Booking Details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text
          style={[
            typography.h3,
            {
              color: isDark ? colors.white : colors.gray[900],
              textAlign: 'center',
              marginBottom: spacing.md,
            },
          ]}
        >
          Booking Not Found
        </Text>
        <Button
          title="Go to My Bookings"
          onPress={() => router.replace('/(tabs)/bookings')}
        />
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusStyle(booking.status, colors);

  const detailItems = [
    { icon: Car, label: 'Service', value: booking.service || 'N/A' },
    { icon: Car, label: 'Vehicle', value: booking.vehicleName || 'N/A' },
    { icon: MapPin, label: 'Location', value: booking.location || 'N/A' },
    {
      icon: DollarSign,
      label: 'Price',
      value:
        booking.price !== undefined ? `$${booking.price.toFixed(2)}` : 'N/A',
    },
    {
      icon: FileText,
      label: 'Notes',
      value: booking.notes || 'No notes provided.',
    },
  ];

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
          Booking Details
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.card,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <View style={styles.mechanicSection}>
            <Image
              source={{
                uri:
                  booking.mechanicImage ||
                  `https://picsum.photos/seed/${booking.mechanicId}/100/100`,
              }}
              style={styles.mechanicImage}
            />
            <View>
              <Text
                style={[
                  typography.h4,
                  { color: isDark ? colors.white : colors.gray[900] },
                ]}
              >
                {booking.mechanicName}
              </Text>
              <Text style={[typography.subtitle1, { color: colors.gray[500] }]}>
                Mechanic
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.dateTimeSection,
              { borderColor: isDark ? colors.gray[200] : colors.gray[100] },
            ]}
          >
            <View style={styles.dateTimeItem}>
              <Calendar
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
              />
              <Text
                style={[
                  typography.body1,
                  {
                    marginLeft: spacing.sm,
                    color: isDark ? colors.white : colors.gray[800],
                  },
                ]}
              >
                {booking.date}
              </Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Clock
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
              />
              <Text
                style={[
                  typography.body1,
                  {
                    marginLeft: spacing.sm,
                    color: isDark ? colors.white : colors.gray[800],
                  },
                ]}
              >
                {booking.time}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            {statusStyle.icon}
            <Text
              style={[
                typography.button,
                { color: statusStyle.color, marginLeft: spacing.xs },
              ]}
            >
              {statusStyle.text}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.detailsContainer,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          {detailItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.detailItem,
                {
                  borderBottomColor: isDark
                    ? colors.gray[200]
                    : colors.gray[100],
                },
              ]}
            >
              <item.icon
                color={colors.gray[500]}
                size={spacing.iconSize.medium}
                style={styles.detailIcon}
              />
              <View style={styles.detailTextContainer}>
                <Text
                  style={[
                    typography.caption,
                    { color: isDark ? colors.gray[600] : colors.gray[500] },
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    typography.body1,
                    { color: isDark ? colors.white : colors.gray[900] },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {booking.status === 'scheduled' && (
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
            title="Cancel Booking"
            onPress={handleCancelBooking}
            variant="danger"
            fullWidth
            leftIcon={
              <XCircle color={colors.white} size={spacing.iconSize.medium} />
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8 },
  headerTitle: { fontWeight: '600', textAlign: 'center', flex: 1 },
  scrollContent: { paddingBottom: 100, padding: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mechanicSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mechanicImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  dateTimeSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dateTimeItem: { flexDirection: 'row', alignItems: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  detailsContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailIcon: { marginRight: 16, marginTop: 2 },
  detailTextContainer: { flex: 1 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
