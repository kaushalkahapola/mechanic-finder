import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function HelpScreen() {
  const { colors, spacing, typography, isDark } = useTheme();

  const supportEmail = 'support@mechfinder.app';
  const supportPhone = '+1-555-0123'; // Example phone

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[100] : colors.primary[500], borderBottomColor: isDark ? colors.gray[200] : colors.primary[600] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={isDark ? colors.primary[500] : colors.white} size={spacing.iconSize.large} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h3, { color: isDark ? colors.primary[500] : colors.white }]}>
          Help & Support
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            Frequently Asked Questions
          </Text>

          <View style={styles.faqItem}>
            <Text style={[typography.subtitle1, styles.faqQuestion, { color: isDark ? colors.primary[400] : colors.primary[600] }]}>
              Q: How do I book a mechanic?
            </Text>
            <Text style={[typography.body1, styles.faqAnswer, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
              A: You can book a mechanic by navigating to the Home screen, selecting a mechanic from the list or map, viewing their profile, and then tapping the "Book Now" button.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={[typography.subtitle1, styles.faqQuestion, { color: isDark ? colors.primary[400] : colors.primary[600] }]}>
              Q: How can I add or manage my vehicles?
            </Text>
            <Text style={[typography.body1, styles.faqAnswer, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
              A: Go to the "Vehicles" tab. You can add a new vehicle by tapping the "Add Vehicle" button or select an existing vehicle to view its details or edit it.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={[typography.subtitle1, styles.faqQuestion, { color: isDark ? colors.primary[400] : colors.primary[600] }]}>
              Q: How do I cancel a booking?
            </Text>
            <Text style={[typography.body1, styles.faqAnswer, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
              A: Go to the "Bookings" tab, select the booking you wish to cancel. If the booking is still in "Scheduled" status, you will see an option to cancel it.
            </Text>
          </View>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900], marginTop: spacing.lg }]}>
            Contact Us
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            If you have any other questions or need further assistance, please don't hesitate to contact our support team.
          </Text>

          <Button
            title={`Email: ${supportEmail}`}
            variant='outline'
            onPress={() => Linking.openURL(`mailto:${supportEmail}`)}
            leftIcon={<Mail color={colors.primary[500]} size={spacing.iconSize.small}/>}
            style={styles.contactButton}
            textStyle={{color: colors.primary[500]}}
          />
          <Button
            title={`Call: ${supportPhone}`}
            variant='outline'
            onPress={() => Linking.openURL(`tel:${supportPhone}`)}
            leftIcon={<Phone color={colors.primary[500]} size={spacing.iconSize.small}/>}
            style={styles.contactButton}
            textStyle={{color: colors.primary[500]}}
          />
           <Button
            title="Chat with Support (Coming Soon)"
            variant='outline'
            onPress={() => Alert.alert("Coming Soon", "Live chat support will be available in a future update.")}
            leftIcon={<MessageSquare color={colors.gray[400]} size={spacing.iconSize.small}/>}
            style={[styles.contactButton, {borderColor: colors.gray[300]}]}
            textStyle={{color: colors.gray[400]}}
            disabled
          />

        </View>
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
    // borderBottomColor: '#eee', // Will be set in component style directly
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 16,
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    marginBottom: 4,
  },
  faqAnswer: {
    lineHeight: 20,
  },
  contactButton: {
    marginTop: 12,
  }
});
