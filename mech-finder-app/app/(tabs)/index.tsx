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
import { Search, MapPin, X, ChevronDown, ChevronUp } from 'lucide-react-native';
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

export default function HomeScreen() {
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

  // Removed toggleView function and expand button usage

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

        {/* Header */}
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
                  <MapPin color={colors.white} size={spacing.iconSize.medium} />
                  {/* <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      color: colors.white,
                      marginLeft: 8,
                      fontWeight: 'bold',
                      fontSize: 14, // Larger font size
                      textShadowColor: 'rgba(0, 0, 0, 0.75)',
                      textShadowOffset: { width: 0, height: 0 },
                      textShadowRadius: 2,
                      width: 150, // Increased max width
                    }}
                  >
                    {mechanic.name}
                  </Text> */}
                </View>
              </Marker>
            ))}
          </MapView>
        ) : null}

        {activeTab === 'list' && (
          <Animated.View
            style={[
              styles.listContainer,
              {
                backgroundColor: isDark ? colors.gray[800] : colors.white,
                height: listHeight,
              },
            ]}
          >
            <Text
              style={[
                typography.h5,
                styles.listTitle,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {filteredMechanics.length} Mechanics Nearby
            </Text>
            <FlatList
              data={filteredMechanics}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MechanicCard
                  mechanic={item}
                  onPress={() => handleMechanicPress(item)}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </Animated.View>
        )}

        {selectedMechanic && activeTab === 'map' && (
          <Animated.View
            style={[
              styles.mechanicDetailPanel,
              {
                backgroundColor: isDark ? colors.gray[800] : colors.white,
                shadowColor: colors.gray[500],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedMechanic(null)}
            >
              <X color={colors.gray[500]} size={spacing.iconSize.medium} />
            </TouchableOpacity>
            <Text
              style={[
                typography.h5,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {selectedMechanic.name}
            </Text>
            <Text
              style={[
                typography.body2,
                { color: isDark ? colors.gray[300] : colors.gray[700] },
              ]}
            >
              {selectedMechanic.address}
            </Text>
            <Text
              style={[
                typography.body2,
                { color: isDark ? colors.gray[300] : colors.gray[700] },
              ]}
            >
              Rating: {selectedMechanic.rating} ({selectedMechanic.reviewCount}{' '}
              reviews)
            </Text>
            <TouchableOpacity
              style={[
                styles.viewMoreButton,
                { backgroundColor: colors.primary[600] },
              ]}
              onPress={() => handleMechanicPress(selectedMechanic)}
            >
              <Text style={[typography.button, { color: colors.white }]}>
                View More Details
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchAndToggleContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 4,
    marginTop: 12, // Add some space between search and toggle
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced vertical padding
    borderRadius: 16,
    width: '100%', // Make it full width within its container
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
    height: 40,
  },
  map: {
    flex: 1,
    marginBottom: 8,
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  mechanicDetailPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  markerContainer: {
    padding: 1,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  viewMoreButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  listTitle: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
});

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
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];

const lightMapStyle = [
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#fefefe' }, { lightness: 20 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { lightness: 17 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { lightness: 18 }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { lightness: 16 }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#f2f2f2' }, { lightness: 19 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
  },
];
