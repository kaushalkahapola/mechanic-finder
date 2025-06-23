import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import { mechanicsData, Mechanic } from '../../mock/mechanicsData';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function EditServicesScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { user } = useAuth();
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (user && user.id) {
      const mechanicProfile = mechanicsData.find((m) => m.id === user.id);
      setMechanic(mechanicProfile || null);
      setServices(mechanicProfile?.services || []);
    }
  }, [user]);

  const addService = () => {
    if (newService.trim() !== '') {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const saveChanges = () => {
    // In a real app, you would update the mechanic's profile in a database here
    Alert.alert('Changes Saved', 'Your services have been updated.');
    router.back();
  };

  if (!mechanic) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.gray[50] : colors.white },
      ]}
    >
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
          Edit Services
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView style={styles.content}>
        <Text
          style={[
            styles.sectionTitle,
            typography.subtitle1,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          Current Services
        </Text>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceItem}>
            <Text
              style={[
                styles.serviceText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {service}
            </Text>
            <TouchableOpacity onPress={() => removeService(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text
          style={[
            styles.sectionTitle,
            typography.subtitle1,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          Add New Service
        </Text>
        <View style={styles.addServiceContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? colors.gray[200] : colors.gray[100],
                color: isDark ? colors.white : colors.gray[900],
              },
            ]}
            placeholder="Enter new service"
            placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
            value={newService}
            onChangeText={setNewService}
          />
          <TouchableOpacity style={styles.addButton} onPress={addService}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  backButton: { padding: 8 },
  headerTitle: { fontWeight: '600', textAlign: 'center', flex: 1 },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  serviceText: {
    fontSize: 16,
  },
  removeButton: {
    color: 'red',
  },
  addServiceContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
