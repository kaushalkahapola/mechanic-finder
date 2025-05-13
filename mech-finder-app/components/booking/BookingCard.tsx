import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Calendar, Clock, Car } from 'lucide-react-native';
import { Booking } from '@/mock/bookingsData';

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const { colors, spacing, typography, isDark } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return colors.primary[500];
      case 'in_progress':
        return colors.warning[500];
      case 'completed':
        return colors.success[500];
      case 'cancelled':
        return colors.error[500];
      default:
        return colors.gray[500];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.gray[100] : colors.white,
          borderColor: isDark ? colors.gray[200] : colors.gray[200],
        },
      ]}
      onPress={() => onPress(booking)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: booking.mechanicImage }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.name,
              typography.subtitle1,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            {booking.mechanicName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(booking.status) + '20' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                typography.caption,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {getStatusText(booking.status)}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.service,
            typography.body2,
            { color: isDark ? colors.gray[700] : colors.gray[700], fontFamily: 'Inter-Medium' },
          ]}
        >
          {booking.service}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar color={colors.gray[500]} size={spacing.iconSize.small} />
            <Text
              style={[
                styles.infoText,
                typography.body2,
                { color: isDark ? colors.gray[700] : colors.gray[700] },
              ]}
            >
              {formatDate(booking.date)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Clock color={colors.gray[500]} size={spacing.iconSize.small} />
            <Text
              style={[
                styles.infoText,
                typography.body2,
                { color: isDark ? colors.gray[700] : colors.gray[700] },
              ]}
            >
              {booking.time}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Car color={colors.gray[500]} size={spacing.iconSize.small} />
            <Text
              style={[
                styles.infoText,
                typography.body2,
                { color: isDark ? colors.gray[700] : colors.gray[700] },
              ]}
            >
              {booking.vehicleName}
            </Text>
          </View>

          <Text
            style={[
              styles.price,
              typography.body2,
              {
                color: isDark ? colors.primary[400] : colors.primary[500],
                fontFamily: 'Inter-SemiBold',
              },
            ]}
          >
            ${booking.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    textTransform: 'uppercase',
  },
  service: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
  },
  price: {
    marginLeft: 4,
  },
});