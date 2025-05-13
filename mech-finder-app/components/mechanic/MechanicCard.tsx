import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Star, MapPin } from 'lucide-react-native';
import { Mechanic } from '@/mock/mechanicsData';

interface MechanicCardProps {
  mechanic: Mechanic;
  onPress: (mechanic: Mechanic) => void;
}

export const MechanicCard: React.FC<MechanicCardProps> = ({ mechanic, onPress }) => {
  const { colors, spacing, typography, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.gray[100] : colors.white,
          borderColor: isDark ? colors.gray[200] : colors.gray[200],
        },
      ]}
      onPress={() => onPress(mechanic)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: mechanic.profileImage }} style={styles.image} />
      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            typography.subtitle1,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          {mechanic.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Star
            color={colors.warning[500]}
            fill={colors.warning[500]}
            size={spacing.iconSize.small}
          />
          <Text
            style={[
              styles.rating,
              typography.body2,
              { color: isDark ? colors.gray[700] : colors.gray[700] },
            ]}
          >
            {mechanic.rating} ({mechanic.reviewCount} reviews)
          </Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin color={colors.gray[500]} size={spacing.iconSize.small} />
          <Text
            style={[
              styles.distance,
              typography.body2,
              { color: isDark ? colors.gray[700] : colors.gray[700] },
            ]}
          >
            {mechanic.distance} miles away
          </Text>
        </View>
        
        <View style={styles.servicesContainer}>
          {mechanic.services.slice(0, 3).map((service, index) => (
            <View
              key={index}
              style={[
                styles.serviceTag,
                { backgroundColor: isDark ? colors.gray[200] : colors.gray[100] },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: isDark ? colors.gray[800] : colors.gray[800] },
                ]}
              >
                {service}
              </Text>
            </View>
          ))}
          {mechanic.services.length > 3 && (
            <View
              style={[
                styles.serviceTag,
                { backgroundColor: isDark ? colors.gray[200] : colors.gray[100] },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: isDark ? colors.gray[800] : colors.gray[800] },
                ]}
              >
                +{mechanic.services.length - 3} more
              </Text>
            </View>
          )}
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distance: {
    marginLeft: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
});