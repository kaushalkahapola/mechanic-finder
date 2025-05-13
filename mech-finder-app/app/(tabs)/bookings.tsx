import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { BookingCard } from '@/components/booking/BookingCard';
import { Booking, bookingsData } from '@/mock/bookingsData';

type FilterType = 'all' | 'upcoming' | 'past';

export default function BookingsScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleBookingPress = (booking: Booking) => {
    router.push({
      pathname: '/booking/[id]',
      params: { id: booking.id }
    });
  };

  const filterBookings = () => {
    const today = new Date();
    
    switch (activeFilter) {
      case 'upcoming':
        return bookingsData.filter(
          (booking) => 
            new Date(booking.date) >= today && 
            booking.status !== 'cancelled' && 
            booking.status !== 'completed'
        );
      case 'past':
        return bookingsData.filter(
          (booking) => 
            new Date(booking.date) < today || 
            booking.status === 'cancelled' || 
            booking.status === 'completed'
        );
      default:
        return bookingsData;
    }
  };

  const filteredBookings = filterBookings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            typography.h3,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          My Bookings
        </Text>
      </View>

      <View
        style={[
          styles.filterContainer,
          { backgroundColor: isDark ? colors.gray[100] : colors.white },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && {
              backgroundColor: colors.primary[500],
            },
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              typography.button,
              {
                color: activeFilter === 'all' ? colors.white : (isDark ? colors.gray[700] : colors.gray[700]),
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'upcoming' && {
              backgroundColor: colors.primary[500],
            },
          ]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterText,
              typography.button,
              {
                color: activeFilter === 'upcoming' ? colors.white : (isDark ? colors.gray[700] : colors.gray[700]),
              },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'past' && {
              backgroundColor: colors.primary[500],
            },
          ]}
          onPress={() => setActiveFilter('past')}
        >
          <Text
            style={[
              styles.filterText,
              typography.button,
              {
                color: activeFilter === 'past' ? colors.white : (isDark ? colors.gray[700] : colors.gray[700]),
              },
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard booking={item} onPress={handleBookingPress} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bookingsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              typography.subtitle1,
              { color: isDark ? colors.gray[700] : colors.gray[700] },
            ]}
          >
            No {activeFilter === 'all' ? '' : activeFilter} bookings found
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  filterText: {
    textAlign: 'center',
  },
  bookingsList: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
  },
});