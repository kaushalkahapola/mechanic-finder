import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { X, Plus, Save, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useData } from '@/context/DataContext';
import { useAuth } from '../../context/AuthContext';

const EditProfileScreen = () => {
  const { colors, spacing, typography, isDark } = useTheme();
  const { user } = useAuth();
  const { mechanics, getMechanicById, updateMechanic } = useData();
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    if (user && user.id) {
      const mechanicProfile = getMechanicById(user.id);
      if (mechanicProfile) {
        setSpecialties(mechanicProfile.services || []);
        setCertifications(mechanicProfile.certifications || []);
      }
    }
  }, [user, getMechanicById]);

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() !== '') {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    const updatedSpecialties = [...specialties];
    updatedSpecialties.splice(index, 1);
    setSpecialties(updatedSpecialties);
  };

  const handleAddCertification = () => {
    if (newCertification.trim() !== '') {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (index: number) => {
    const updatedCertifications = [...certifications];
    updatedCertifications.splice(index, 1);
    setCertifications(updatedCertifications);
  };

  const handleSaveChanges = () => {
    if (user && user.id) {
      const mechanicProfile = getMechanicById(user.id);
      if (mechanicProfile) {
        const updatedMechanic = {
          ...mechanicProfile,
          services: specialties,
          certifications: certifications,
        };
        updateMechanic(updatedMechanic);
        Alert.alert('Success', 'Your profile has been updated!');
      }
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.title,
            typography.h4,
            { color: isDark ? colors.white : colors.gray[900] },
          ]}
        >
          Edit Profile
        </Text>

        {/* Specialties Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.subtitle1,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Specialties
          </Text>

          {specialties.length > 0 ? (
            specialties.map((specialty: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.itemContainer,
                  {
                    borderBottomColor: isDark
                      ? colors.gray[300]
                      : colors.gray[200],
                  },
                ]}
              >
                <Text
                  style={[
                    typography.body1,
                    { color: isDark ? colors.white : colors.gray[900] },
                  ]}
                >
                  {specialty}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveSpecialty(index)}
                  style={styles.removeButton}
                >
                  <X
                    color={isDark ? colors.error[400] : colors.error[500]}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.emptyText,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              No specialties added yet
            </Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                typography.body1,
                {
                  backgroundColor: isDark ? colors.gray[200] : colors.gray[100],
                  color: isDark ? colors.white : colors.gray[900],
                  borderColor: isDark ? colors.gray[300] : colors.gray[200],
                },
              ]}
              placeholder="Add a new specialty"
              placeholderTextColor={
                isDark ? colors.gray[400] : colors.gray[500]
              }
              value={newSpecialty}
              onChangeText={setNewSpecialty}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: colors.primary[500] },
              ]}
              onPress={handleAddSpecialty}
            >
              <Plus color={colors.white} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Certifications Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.subtitle1,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Certifications
          </Text>

          {certifications.length > 0 ? (
            certifications.map((certification: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.itemContainer,
                  {
                    borderBottomColor: isDark
                      ? colors.gray[300]
                      : colors.gray[200],
                  },
                ]}
              >
                <Text
                  style={[
                    typography.body1,
                    { color: isDark ? colors.white : colors.gray[900] },
                  ]}
                >
                  {certification}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveCertification(index)}
                  style={styles.removeButton}
                >
                  <X
                    color={isDark ? colors.error[400] : colors.error[500]}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.emptyText,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              No certifications added yet
            </Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                typography.body1,
                {
                  backgroundColor: isDark ? colors.gray[200] : colors.gray[100],
                  color: isDark ? colors.white : colors.gray[900],
                  borderColor: isDark ? colors.gray[300] : colors.gray[200],
                },
              ]}
              placeholder="Add a new certification"
              placeholderTextColor={
                isDark ? colors.gray[400] : colors.gray[500]
              }
              value={newCertification}
              onChangeText={setNewCertification}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: colors.primary[500] },
              ]}
              onPress={handleAddCertification}
            >
              <Plus color={colors.white} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary[500] }]}
          onPress={handleSaveChanges}
        >
          <Save color={colors.white} size={20} />
          <Text
            style={[
              styles.saveButtonText,
              typography.button,
              { color: colors.white },
            ]}
          >
            Save Changes
          </Text>
          <ChevronRight color={colors.white} size={20} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  removeButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  addButton: {
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    marginHorizontal: 8,
  },
});

export default EditProfileScreen;
