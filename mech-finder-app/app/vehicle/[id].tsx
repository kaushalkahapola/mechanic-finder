import React from 'react';
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
  Edit3,
  Trash2,
  Calendar,
  Gauge,
  Palette,
  Car,
  Tag,
  Fingerprint,
} from 'lucide-react-native';
// Vehicle type can be imported from DataContext if preferred, or keep mock/vehiclesData for type only
import { Vehicle } from '@/mock/vehiclesData';
import { useData } from '@/context/DataContext'; // Import useData
import { Button } from '@/components/ui/Button';

export default function VehicleDetailScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getVehicleById, deleteVehicle: contextDeleteVehicle } = useData(); // Get functions from context

  const vehicle = getVehicleById(id || ''); // Get vehicle from context

  const handleEdit = () => {
    if (vehicle) {
      router.push(`/vehicle/edit/${vehicle.id}`);
    }
  };

  const handleDelete = () => {
    if (!vehicle) return;
    Alert.alert(
      'Delete Vehicle',
      `Are you sure you want to delete ${vehicle.make} ${vehicle.model}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            contextDeleteVehicle(vehicle.id); // Use context function
            Alert.alert(
              'Vehicle Deleted',
              `${vehicle.make} ${vehicle.model} has been removed.`,
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/(tabs)/vehicles'),
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!vehicle) {
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
          Vehicle Not Found
        </Text>
        <Button
          title="Go to My Vehicles"
          onPress={() => router.replace('/(tabs)/vehicles')}
        />
      </SafeAreaView>
    );
  }

  const detailItems = [
    { icon: Car, label: 'Type', value: vehicle.type },
    { icon: Tag, label: 'License Plate', value: vehicle.licensePlate },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: Fingerprint, label: 'VIN', value: vehicle.vin },
    { icon: Gauge, label: 'Mileage', value: `${vehicle.mileage} miles` },
    { icon: Calendar, label: 'Last Service', value: vehicle.lastService },
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
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri:
              vehicle.image ||
              `https://ui-avatars.com/api/?name=${vehicle.make}`,
          }}
          style={styles.vehicleImage}
        />

        <View style={styles.detailsContainer}>
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
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
                style={styles.detailIcon}
              />
              <View>
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
          title="Edit Vehicle"
          onPress={handleEdit}
          variant="outline"
          style={styles.actionButton}
          leftIcon={
            <Edit3 color={colors.primary[500]} size={spacing.iconSize.small} />
          }
          textStyle={{ color: colors.primary[500] }}
        />
        <Button
          title="Delete Vehicle"
          onPress={handleDelete}
          variant="danger"
          style={styles.actionButton}
          leftIcon={
            <Trash2 color={colors.white} size={spacing.iconSize.small} />
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
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for footer
  },
  vehicleImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailIcon: {
    marginRight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    paddingBottom: 24, // Extra padding for home bar
    borderTopWidth: 1,
    // borderTopColor: '#eee', // Will be set in component style directly
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});
