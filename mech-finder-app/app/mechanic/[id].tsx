import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Star,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
// import { mechanicsData } from '@/mock/mechanicsData'; // No longer needed directly
import { useData } from '@/context/DataContext'; // Import useData
import { Button } from '@/components/ui/Button';

export default function MechanicDetailScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getMechanicById } = useData(); // Get context function
  const [expanded, setExpanded] = useState(false);
  
  const mechanic = getMechanicById(id || ''); // Use context getter

  if (!mechanic) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] }]}>
        <Text
          style={[
            typography.h3,
            { color: isDark ? colors.white : colors.gray[900], textAlign: 'center' },
          ]}
        >
          Mechanic not found
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    router.push({
      pathname: '/booking/new',
      params: { mechanicId: mechanic.id }
    });
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: isDark ? colors.gray[700] : colors.white },
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft
            color={isDark ? colors.white : colors.gray[900]}
            size={spacing.iconSize.medium}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image source={{ uri: mechanic.profileImage }} style={styles.profileImage} />
          
          <View style={styles.nameContainer}>
            <Text
              style={[
                styles.name,
                typography.h2,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.name}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Star
                color={colors.warning[500]}
                fill={colors.warning[500]}
                size={spacing.iconSize.medium}
              />
              <Text
                style={[
                  styles.rating,
                  typography.subtitle2,
                  { color: isDark ? colors.gray[700] : colors.gray[700] },
                ]}
              >
                {mechanic.rating} ({mechanic.reviewCount} reviews)
              </Text>
            </View>
          </View>

          <Button
            title="Book Now"
            onPress={handleBookNow}
            fullWidth
            style={styles.bookButton}
          />
        </View>

        <View
          style={[
            styles.infoSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <View style={styles.infoRow}>
            <MapPin color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.address}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Phone color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.phoneNumber}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Mail color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.email}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Available: {mechanic.availability.days.join(', ')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Clock color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Hours: {mechanic.availability.hours}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.aboutSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            About
          </Text>
          <Text
            style={[
              styles.aboutText,
              typography.body1,
              { color: isDark ? colors.gray[600] : colors.gray[700] },
            ]}
            numberOfLines={expanded ? undefined : 3}
          >
            {mechanic.about}
          </Text>
          {mechanic.about.length > 120 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={toggleExpanded}
            >
              <Text
                style={[
                  typography.button,
                  { color: colors.primary[500] },
                ]}
              >
                {expanded ? 'Show Less' : 'Read More'}
              </Text>
              {expanded ? (
                <ChevronUp color={colors.primary[500]} size={spacing.iconSize.small} />
              ) : (
                <ChevronDown color={colors.primary[500]} size={spacing.iconSize.small} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.servicesSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Services
          </Text>
          <View style={styles.servicesList}>
            {mechanic.services.map((service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceItem,
                  { backgroundColor: isDark ? colors.gray[200] : colors.gray[100] },
                ]}
              >
                <Check
                  color={colors.primary[500]}
                  size={spacing.iconSize.small}
                  style={styles.serviceIcon}
                />
                <Text
                  style={[
                    typography.body1,
                    { color: isDark ? colors.white : colors.gray[900] },
                  ]}
                >
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.certSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Certifications
          </Text>
          <View style={styles.certsList}>
            {mechanic.certifications.map((cert, index) => (
              <View
                key={index}
                style={[
                  styles.certItem,
                  { backgroundColor: isDark ? colors.primary[600] : colors.primary[500] },
                ]}
              >
                <Text
                  style={[
                    typography.body2,
                    { color: colors.white },
                  ]}
                >
                  {cert}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.pricing,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Pricing
          </Text>
          <Text
            style={[
              styles.rate,
              typography.h3,
              { color: colors.primary[500] },
            ]}
          >
            ${mechanic.hourlyRate}
          </Text>
          <Text
            style={[
              typography.body2,
              { color: isDark ? colors.gray[600] : colors.gray[600] },
            ]}
          >
            per hour (labor only)
          </Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: isDark ? colors.gray[50] : colors.white },
        ]}
      >
        <Button
          title="Book Now"
          onPress={handleBookNow}
          fullWidth
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
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  profileSection: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
  },
  bookButton: {
    marginVertical: 8,
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
  },
  aboutSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  aboutText: {
    lineHeight: 22,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  servicesSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceIcon: {
    marginRight: 8,
  },
  certSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  certsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  pricing: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  rate: {
    marginVertical: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});