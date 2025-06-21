import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { Search, MapPin, X, List } from 'lucide-react-native';
import { MechanicCard } from '@/components/mechanic/MechanicCard';
import { Mechanic } from '@/mock/mechanicsData'; // Keep type
import { useData } from '@/context/DataContext'; // Import useData
import MapView, { Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');
const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { mechanics: mechanicsDataFromContext } = useData(); // Get mechanics from context
  const [searchQuery, setSearchQuery] = useState('');
  const [showList, setShowList] = useState(true);
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleMechanicPress = (mechanic: Mechanic) => {
    router.push({
      pathname: '/mechanic/[id]',
      params: { id: mechanic.id },
    });
  };

  const handleMarkerPress = (mechanic: Mechanic) => {
    if (Platform.OS !== 'web' && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: mechanic.latitude,
        longitude: mechanic.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const toggleListView = () => {
    const isOpen = showList;
    bottomSheetRef.current?.snapToIndex(isOpen ? 0 : 1);
    setShowList(!isOpen);
  };

  const listHeight = bottomSheetAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 300],
  });

  const filteredMechanics = mechanicsDataFromContext.filter( // Use mechanics from context
    (mechanic) =>
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const renderMap = () => {
    if (Platform.OS === 'web' || !MapView) {
      return (
        <View
          style={[
            styles.webMapPlaceholder,
            { backgroundColor: colors.gray[200] },
          ]}
        >
          <Text style={[typography.body1, { color: colors.gray[600] }]}>
            Map view is only available in the mobile app
          </Text>
          <TouchableOpacity
            style={[
              styles.getAppButton,
              { backgroundColor: colors.primary[500] },
            ]}
            onPress={() => {
              // Handle app download or show QR code
            }}
          >
            <Text style={[typography.button, { color: colors.white }]}>
              Get the mobile app
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        provider="google"
        initialRegion={INITIAL_REGION}
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
              <MapPin color={colors.white} size={spacing.iconSize.small} />
            </View>
          </Marker>
        ))}
      </MapView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] },
        ]}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDark ? colors.gray[100] : colors.white,
                borderColor: isDark ? colors.gray[300] : colors.gray[300],
              },
            ]}
          >
            <Search color={colors.gray[500]} size={spacing.iconSize.medium} />
            <TextInput
              style={[
                styles.searchInput,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
              placeholder="Search mechanics, services..."
              placeholderTextColor={
                isDark ? colors.gray[600] : colors.gray[500]
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
        </View>

        <View style={styles.mapContainer}>
          {renderMap()}
          <TouchableOpacity
            style={[
              styles.viewToggle,
              {
                backgroundColor: isDark
                  ? colors.primary[600]
                  : colors.primary[500],
              },
            ]}
            onPress={toggleListView}
          >
            <List color={colors.white} size={spacing.iconSize.medium} />
          </TouchableOpacity>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[80, 300]}
          onChange={(index) => setShowList(index === 1)}
        >
          <View style={styles.bottomSheetHandle} />
          <Text
            style={[
              styles.bottomSheetTitle,
              typography.h4,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Nearby Mechanics
          </Text>
          <FlatList
            data={filteredMechanics} // Already using filtered from context data
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MechanicCard mechanic={item} onPress={() => handleMechanicPress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mechanicsList}
          />
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  getAppButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  viewToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheet: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomSheetTitle: {
    marginBottom: 16,
  },
  mechanicsList: {
    paddingBottom: 24,
  },
});
