import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useData } from '@/context/DataContext'; // Import useData

export default function AddVehicleScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { addVehicle: contextAddVehicle } = useData(); // Get addVehicle from context
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [image, setImage] = useState(''); // Optional: for future use

  const handleAddVehicle = () => {
    if (!make || !model || !year || !licensePlate) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Make, Model, Year, License Plate).');
      return;
    }

    contextAddVehicle({ // Use context function
      make,
      model,
      year: parseInt(year, 10),
      type,
      licensePlate,
      color,
      vin,
      mileage: parseInt(mileage, 10) || 0,
      // image is optional in addVehicle, will be defaulted by context if not provided
      ...(image && { image }),
    });

    Alert.alert('Vehicle Added', `${make} ${model} has been added to your garage.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[100] : colors.primary[500], borderBottomColor: isDark ? colors.gray[200] : colors.primary[600]}]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={isDark ? colors.primary[500] : colors.white} size={spacing.iconSize.large} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h3, { color: isDark ? colors.primary[500] : colors.white }]}>
          Add New Vehicle
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Input
            label="Make"
            placeholder="e.g., Toyota"
            value={make}
            onChangeText={setMake}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="Model"
            placeholder="e.g., Camry"
            value={model}
            onChangeText={setModel}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="Year"
            placeholder="e.g., 2023"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="Type (e.g., Sedan, SUV)"
            placeholder="e.g., Sedan"
            value={type}
            onChangeText={setType}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="License Plate"
            placeholder="e.g., ABC1234"
            value={licensePlate}
            onChangeText={setLicensePlate}
            containerStyle={styles.inputContainer}
            autoCapitalize="characters"
          />
          <Input
            label="Color"
            placeholder="e.g., Blue"
            value={color}
            onChangeText={setColor}
            containerStyle={styles.inputContainer}
          />
          <Input
            label="VIN (Vehicle Identification Number)"
            placeholder="Enter 17-digit VIN"
            value={vin}
            onChangeText={setVin}
            maxLength={17}
            containerStyle={styles.inputContainer}
            autoCapitalize="characters"
          />
          <Input
            label="Mileage"
            placeholder="e.g., 50000"
            value={mileage}
            onChangeText={setMileage}
            keyboardType="numeric"
            containerStyle={styles.inputContainer}
          />
          {/* Future: Add image picker here */}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: isDark ? colors.gray[100] : colors.white, borderTopColor: isDark ? colors.gray[200] : colors.gray[100] }]}>
        <Button
          title="Add Vehicle"
          onPress={handleAddVehicle}
          variant="primary"
          fullWidth
          leftIcon={<Check color={colors.white} size={spacing.iconSize.medium} />}
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
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
});
