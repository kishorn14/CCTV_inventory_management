import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

import LoginScreen from './src/screens/LoginScreen';
import OtpScreen from './src/screens/OtpScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { AdminDashboard, EmployeeDashboard, CustomerDashboard } from './src/screens/Dashboards';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) setProfile(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // USER NOT LOGGED IN
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OtpScreen} />
          </>
        ) : !profile?.name ? (
          // LOGGED IN, BUT NO PROFILE INFO (ONBOARDING REQUIRED)
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          // FULLY LOGGED IN & ONBOARDED -> ROUTE BY ROLE
          <>
            {profile.role === 'admin' && <Stack.Screen name="AdminDashboard" component={AdminDashboard} />}
            {profile.role === 'employee' && <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} />}
            {profile.role === 'customer' && <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
