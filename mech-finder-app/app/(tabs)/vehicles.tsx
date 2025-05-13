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
import { Plus } from 'lucide-react-native';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { Vehicle, vehiclesData } from '@/mock/vehiclesData';
import { Button } from '@/components/ui/Button';

export default function VehiclesScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [vehicles, setVehicles] = useState(vehiclesData);

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: '/vehicle/[id]',
      params: { id: vehicle.id }
    });
  };

  const handleAddVehicle = () => {
    router.push('/vehicle/add');
  };

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
          My Vehicles
        </Text>
        <Button
          title="Add Vehicle"
          variant="primary"
          leftIcon={<Plus color={colors.white} size={spacing.iconSize.small} />}
          onPress={handleAddVehicle}
          size="small"
        />
      </View>

      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VehicleCard vehicle={item} onPress={handleVehiclePress} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.vehiclesList}
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
            No vehicles added yet
          </Text>
          <Button
            title="Add Your First Vehicle"
            variant="primary"
            leftIcon={<Plus color={colors.white} size={spacing.iconSize.medium} />}
            onPress={handleAddVehicle}
            style={styles.addButton}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '700',
  },
  vehiclesList: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    minWidth: 200,
  },
});