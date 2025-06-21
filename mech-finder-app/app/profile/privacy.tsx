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

export default function PrivacyPolicyScreen() {
  const { colors, spacing, typography, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[100] : colors.primary[500], borderBottomColor: isDark ? colors.gray[200] : colors.primary[600] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={isDark ? colors.primary[500] : colors.white} size={spacing.iconSize.large} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h3, { color: isDark ? colors.primary[500] : colors.white }]}>
          Privacy Policy
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            1. Information We Collect
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us. The types of information we may collect include your name, email address, postal address, phone number, fax number, credit card information and other contact or identifying information you choose to provide.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            2. How We Use Information
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            We may use the information we collect for various purposes, including to:
            {'\n'}- Provide, maintain and improve our services;
            {'\n'}- Provide and deliver the products and services you request, process transactions and send you related information, including confirmations and invoices;
            {'\n'}- Send you technical notices, updates, security alerts and support and administrative messages;
            {'\n'}- Respond to your comments, questions and requests and provide customer service;
            {'\n'}- Communicate with you about products, services, offers, promotions, rewards, and events offered by Company and others, and provide news and information we think will be of interest to you.
          </Text>

          <Text style={[typography.h4, styles.sectionTitle, { color: isDark ? colors.white : colors.gray[900] }]}>
            3. Sharing of Information
          </Text>
          <Text style={[typography.body1, styles.paragraph, { color: isDark ? colors.gray[300] : colors.gray[700] }]}>
            We may share personal information as follows:
            {'\n'}- With vendors, consultants and other service providers who need access to such information to carry out work on our behalf;
            {'\n'}- In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process;
            {'\n'}- If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property and safety of Company or others;
            {'\n'}- In connection with, or during negotiations of, any merger, sale of company assets, financing or acquisition of all or a portion of our business by another company;
            {'\n'}- Between and among Company and our current and future parents, affiliates, subsidiaries and other companies under common control and ownership; and
            {'\n'}- With your consent or at your direction.
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
