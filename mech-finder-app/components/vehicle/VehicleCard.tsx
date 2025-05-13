import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Calendar, Info } from 'lucide-react-native';
import { Vehicle } from '@/mock/vehiclesData';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress }) => {
  const { colors, spacing, typography, isDark } = useTheme();

  // Format the last service date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      onPress={() => onPress(vehicle)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: vehicle.image }} style={styles.image} />
      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            typography.subtitle1,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        
        <View style={styles.infoContainer}>
          <Info color={colors.gray[500]} size={spacing.iconSize.small} />
          <Text
            style={[
              styles.info,
              typography.body2,
              { color: isDark ? colors.gray[700] : colors.gray[700] },
            ]}
          >
            {vehicle.type} • {vehicle.color} • {vehicle.licensePlate}
          </Text>
        </View>
        
        <View style={styles.serviceContainer}>
          <Calendar color={colors.gray[500]} size={spacing.iconSize.small} />
          <Text
            style={[
              styles.service,
              typography.body2,
              { color: isDark ? colors.gray[700] : colors.gray[700] },
            ]}
          >
            Last service: {formatDate(vehicle.lastService)}
          </Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View
            style={[
              styles.detailTag,
              { backgroundColor: isDark ? colors.gray[200] : colors.gray[100] },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: isDark ? colors.gray[800] : colors.gray[800] },
              ]}
            >
              {vehicle.mileage.toLocaleString()} miles
            </Text>
          </View>
          <View
            style={[
              styles.detailTag,
              { backgroundColor: isDark ? colors.gray[200] : colors.gray[100] },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: isDark ? colors.gray[800] : colors.gray[800] },
              ]}
            >
              VIN: {vehicle.vin.slice(-4)}
            </Text>
          </View>
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
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  info: {
    marginLeft: 4,
  },
  serviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  service: {
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
});