import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsScreen() {
  const { colors, spacing, typography, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[100] : colors.primary[500], borderBottomColor: isDark ? colors.gray[200] : colors.primary[600] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={isDark ? colors.primary[500] : colors.white} size={spacing.iconSize.large} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h3, { color: isDark ? colors.primary[500] : colors.white }]}>
          Terms & Conditions
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            1. Introduction
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            Welcome to Mechanic Finder! These terms and conditions outline the rules and regulations for the use of Mechanic Finder's Website and Mobile Application.
            By accessing this app we assume you accept these terms and conditions. Do not continue to use Mechanic Finder if you do not agree to take all of the terms and conditions stated on this page.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            2. Intellectual Property Rights
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            Other than the content you own, under these Terms, Mechanic Finder and/or its licensors own all the intellectual property rights and materials contained in this App.
            You are granted limited license only for purposes of viewing the material contained on this App.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            3. Restrictions
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            You are specifically restricted from all of the following:
            {'\n'}- Publishing any App material in any other media;
            {'\n'}- Selling, sublicensing and/or otherwise commercializing any App material;
            {'\n'}- Publicly performing and/or showing any App material;
            {'\n'}- Using this App in any way that is or may be damaging to this App;
            {'\n'}- Using this App in any way that impacts user access to this App;
            {'\n'}- Using this App contrary to applicable laws and regulations, or in any way may cause harm to the App, or to any person or business entity;
            {'\n'}- Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this App;
            {'\n'}- Using this App to engage in any advertising or marketing.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            4. Your Content
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            In these App Standard Terms and Conditions, “Your Content” shall mean any audio, video text, images or other material you choose to display on this App. By displaying Your Content, you grant Mechanic Finder a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
            Your Content must be your own and must not be invading any third-party's rights. Mechanic Finder reserves the right to remove any of Your Content from this App at any time without notice.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            5. No warranties
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            This App is provided "as is," with all faults, and Mechanic Finder express no representations or warranties, of any kind related to this App or the materials contained on this App. Also, nothing contained on this App shall be interpreted as advising you.
          </Text>

          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[400] : colors.gray[600], marginTop: 20, fontStyle: 'italic' }]}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
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
    marginBottom: 8,
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
});
