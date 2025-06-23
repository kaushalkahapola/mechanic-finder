import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Bell,
  CheckCircle,
  XCircle,
  Info,
  Clock,
  ArrowLeft,
  Trash2,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load current user
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Load notifications for this user
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          const allNotifications: Notification[] = JSON.parse(storedNotifications);
          // Filter notifications for current user (in real app, use proper user ID)
          const userNotifications = allNotifications.filter(
            notification => notification.userId === user.name
          );
          setNotifications(userNotifications.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      setNotifications(updatedNotifications);
      
      // Update in storage
      const allNotifications = await AsyncStorage.getItem('notifications');
      if (allNotifications) {
        const storedNotifications: Notification[] = JSON.parse(allNotifications);
        const updatedStoredNotifications = storedNotifications.map(notification => {
          if (notification.id === notificationId) {
            return { ...notification, read: true };
          }
          return notification;
        });
        await AsyncStorage.setItem('notifications', JSON.stringify(updatedStoredNotifications));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedNotifications = notifications.filter(
                notification => notification.id !== notificationId
              );
              setNotifications(updatedNotifications);
              
              // Update in storage
              const allNotifications = await AsyncStorage.getItem('notifications');
              if (allNotifications) {
                const storedNotifications: Notification[] = JSON.parse(allNotifications);
                const updatedStoredNotifications = storedNotifications.filter(
                  notification => notification.id !== notificationId
                );
                await AsyncStorage.setItem('notifications', JSON.stringify(updatedStoredNotifications));
              }
            } catch (error) {
              console.error('Error deleting notification:', error);
            }
          },
        },
      ]
    );
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setNotifications([]);
              
              // Update in storage
              const allNotifications = await AsyncStorage.getItem('notifications');
              if (allNotifications) {
                const storedNotifications: Notification[] = JSON.parse(allNotifications);
                const updatedStoredNotifications = storedNotifications.filter(
                  notification => notification.userId !== currentUser?.name
                );
                await AsyncStorage.setItem('notifications', JSON.stringify(updatedStoredNotifications));
              }
            } catch (error) {
              console.error('Error clearing notifications:', error);
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} color={colors.success[500]} />;
      case 'error':
        return <XCircle size={24} color={colors.error[500]} />;
      case 'warning':
        return <Clock size={24} color={colors.warning[500]} />;
      default:
        return <Info size={24} color={colors.primary[500]} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return colors.success[100];
      case 'error':
        return colors.error[100];
      case 'warning':
        return colors.warning[100];
      default:
        return colors.primary[100];
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.gray[500]} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
          Notifications
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Text style={[styles.clearButtonText, typography.body2, { color: colors.error[500] }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={64} color={colors.gray[400]} />
            <Text style={[styles.emptyTitle, typography.h3, { color: colors.gray[600] }]}>
              No notifications yet
            </Text>
            <Text style={[styles.emptySubtitle, typography.body2, { color: colors.gray[500] }]}>
              You'll see updates about your repair requests here
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: isDark ? colors.gray[800] : colors.white,
                    borderLeftColor: getNotificationColor(notification.type),
                    opacity: notification.read ? 0.7 : 1,
                  },
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </View>
                    <View style={styles.notificationInfo}>
                      <Text style={[styles.notificationTitle, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
                        {notification.title}
                      </Text>
                      <Text style={[styles.notificationTime, typography.caption, { color: colors.gray[500] }]}>
                        {formatTimeAgo(notification.createdAt)}
                      </Text>
                    </View>
                    {!notification.read && (
                      <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />
                    )}
                  </View>
                  <Text style={[styles.notificationMessage, typography.body2, { color: colors.gray[600] }]}>
                    {notification.message}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNotification(notification.id)}
                >
                  <Trash2 size={16} color={colors.gray[400]} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  notificationsList: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationTime: {
    fontWeight: '400',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    marginLeft: 36,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
}); 