import 'react-native-gesture-handler';
import './src/i18n/config';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NetworkProvider } from './src/context/NetworkContext';
import { OfflineBanner } from './src/components/OfflineBanner';
import { COLORS } from './src/constants/theme';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WorkerDashboardScreen from './src/screens/worker/WorkerDashboardScreen';
import WorkerJobsScreen from './src/screens/worker/WorkerJobsScreen';
import JobDetailScreen from './src/screens/worker/JobDetailScreen';
import ExpenseManagementScreen from './src/screens/worker/ExpenseManagementScreen';
import ManagerDashboardScreen from './src/screens/manager/ManagerDashboardScreen';
import TeamListScreen from './src/screens/manager/TeamListScreen';
import JobAssignmentScreen from './src/screens/manager/JobAssignmentScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import UserManagementScreen from './src/screens/admin/UserManagementScreen';
import CustomerManagementScreen from './src/screens/admin/CustomerManagementScreen';
import ApprovalsScreen from './src/screens/admin/ApprovalsScreen';
import CreateJobScreen from './src/screens/admin/CreateJobScreen';
import CalendarScreen from './src/screens/admin/CalendarScreen';
import CostManagementScreen from './src/screens/manager/CostManagementScreen';
import NotificationsScreen from './src/screens/worker/NotificationsScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import notificationService from './src/services/notification.service';
import * as Notifications from 'expo-notifications';
import { SocketProvider } from './src/context/SocketContext';
import ToastNotification from './src/components/ToastNotification';
import { QueueService } from './src/services/QueueService';
import { SyncManager } from './src/services/SyncManager';
import { linking } from './src/utils/linking';
import { useTranslation } from 'react-i18next';

// Web specific styles injection
// ... existing code ...

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  // ... existing useEffects ...

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName={getInitialRoute()}
          detachInactiveScreens={false}
          screenOptions={{
            animationEnabled: false,
            headerShown: true
          }}
        >
          {user ? (
            <>
              {/* Worker Screens */}
              <Stack.Screen
                name="WorkerDashboard"
                component={WorkerDashboardScreen}
                options={{ title: t('navigation.home') }}
              />
              <Stack.Screen
                name="Jobs"
                component={WorkerJobsScreen}
                options={{ title: t('navigation.jobs') }}
              />
              <Stack.Screen
                name="JobDetail"
                component={JobDetailScreen}
                options={{ title: t('worker.jobDetails') }}
              />
              <Stack.Screen
                name="ExpenseManagement"
                component={ExpenseManagementScreen}
                options={{ title: t('worker.expenses'), headerShown: false }}
              />

              {/* Manager Screens */}
              <Stack.Screen
                name="ManagerDashboard"
                component={ManagerDashboardScreen}
                options={{ title: 'Manager Dashboard' }}
              />
              <Stack.Screen
                name="TeamList"
                component={TeamListScreen}
                options={{ title: t('navigation.teams') }}
              />
              <Stack.Screen
                name="JobAssignment"
                component={JobAssignmentScreen}
                options={{ title: t('navigation.jobAssignment') || 'Job Assignment' }}
              />
              <Stack.Screen
                name="CostManagement"
                component={CostManagementScreen}
                options={{ title: t('worker.expenses') }}
              />
              {/* Admin Screens */}
              <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboardScreen}
                options={{ title: 'Admin Dashboard' }}
              />
              <Stack.Screen
                name="UserManagement"
                component={UserManagementScreen}
                options={{ title: t('navigation.userManagement') || 'User Management' }}
              />
              <Stack.Screen
                name="CustomerManagement"
                component={CustomerManagementScreen}
                options={{ title: t('navigation.customers') || 'Customer Management' }}
              />
              <Stack.Screen
                name="Approvals"
                component={ApprovalsScreen}
                options={{ title: t('navigation.approvals') || 'Approvals' }}
              />
              <Stack.Screen
                name="CreateJob"
                component={CreateJobScreen}
                options={{ title: t('navigation.createJob') || 'Create Job' }}
              />
              <Stack.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{ headerShown: false }}
              />
              {/* Profile Screen */}
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: t('navigation.profile') }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: t('navigation.notifications') || 'Notifications' }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.backgroundDark }}>
          <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Bir hata oluştu / An error occurred</Text>
          <Text style={{ color: 'red', textAlign: 'center' }}>{this.state.error?.toString()}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  React.useEffect(() => {
    // Initialize Offline Queue
    QueueService.initialize();
    // Initialize Sync Manager
    SyncManager.init();
  }, []);

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      // CRITICAL: Ensure touch-action is permitted for native scrolling on web
      ...(Platform.OS === 'web' && { touchAction: 'pan-y pan-x' })
    }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <NetworkProvider>
            <ThemeProvider>
              <AuthProvider>
                <SocketProvider>
                  <OfflineBanner />
                  <AppNavigator />
                  <ToastNotification />
                </SocketProvider>
              </AuthProvider>
            </ThemeProvider>
          </NetworkProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
  },
});
// Trigger 2
