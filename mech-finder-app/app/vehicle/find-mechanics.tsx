import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { Search, MapPin, X, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react-native';
import { MechanicCard } from '@/components/mechanic/MechanicCard';
import { Mechanic } from '@/mock/mechanicsData';
import { useData } from '@/context/DataContext';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const COLOMBO_REGION = {
  latitude: 6.9271,
  longitude: 79.8612,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function FindMechanicsScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { mechanics: mechanicsDataFromContext } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'map'
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null
  );
  const mapRef = useRef<MapView>(null);
  const animation = useRef(new Animated.Value(1)).current;

  const filteredMechanics = useMemo(() => {
    return mechanicsDataFromContext.filter(
      (mechanic) =>
        mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mechanic.services.some((service) =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, mechanicsDataFromContext]);

  const handleMechanicPress = useCallback((mechanic: Mechanic) => {
    router.push({
      pathname: '/mechanic/[id]',
      params: { id: mechanic.id },
    });
  }, []);

  const handleMarkerPress = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    if (Platform.OS !== 'web' && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: mechanic.latitude,
        longitude: mechanic.longitude,
        latitudeDelta: 0.005, // Zoom in a bit more
        longitudeDelta: 0.005,
      });
    }
  };

  const listHeight = height * 0.6;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        {/* Header with Back Button */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark ? colors.gray[800] : colors.white,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.gray[500]} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              typography.h2,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Find Mechanics
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar and Tab Toggle */}
        <View
          style={[
            styles.searchAndToggleContainer,
            {
              backgroundColor: isDark ? colors.gray[900] : colors.gray[50],
            },
          ]}
        >
          <View
            style={[
              styles.searchBarContainer,
              {
                backgroundColor: isDark ? colors.gray[800] : colors.white,
                shadowColor: colors.gray[500],
              },
            ]}
          >
            <Search
              color={colors.gray[500]}
              size={spacing.iconSize.medium}
              style={styles.searchIcon}
            />
            <TextInput
              style={[
                styles.searchInput,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
              placeholder="Search mechanics or services..."
              placeholderTextColor={
                isDark ? colors.gray[400] : colors.gray[600]
              }
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color={colors.gray[500]} size={spacing.iconSize.medium} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'list' && {
                  backgroundColor: colors.primary[600],
                },
              ]}
              onPress={() => setActiveTab('list')}
            >
              <Text
                style={[
                  typography.button,
                  {
                    color:
                      activeTab === 'list' ? colors.white : colors.gray[600],
                  },
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'map' && {
                  backgroundColor: colors.primary[600],
                },
              ]}
              onPress={() => setActiveTab('map')}
            >
              <Text
                style={[
                  typography.button,
                  {
                    color:
                      activeTab === 'map' ? colors.white : colors.gray[600],
                  },
                ]}
              >
                Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        {activeTab === 'map' ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={COLOMBO_REGION}
            customMapStyle={isDark ? darkMapStyle : lightMapStyle}
          >
            {filteredMechanics.map((mechanic) => (
              <Marker
                key={mechanic.id}
                coordinate={{
                  latitude: mechanic.latitude,
                  longitude: mechanic.longitude,
                }}
                onPress={() => handleMarkerPress(mechanic)}
              >
                <View
                  style={[
                    styles.markerContainer,
                    { backgroundColor: colors.primary[500] },
                  ]}
                >
                  <Text style={[styles.markerText, { color: colors.white }]}>
                    {mechanic.name.charAt(0)}
                  </Text>
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <FlatList
            data={filteredMechanics}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MechanicCard
                mechanic={item}
                onPress={() => handleMechanicPress(item)}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchAndToggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

// Map styles for dark and light themes
const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const lightMapStyle: any[] = []; 