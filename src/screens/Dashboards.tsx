import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';

function SignOutButton() {
  return (
    <TouchableOpacity style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

export function AdminDashboard() {
  return (
    <View style={[styles.container, { backgroundColor: '#fdf0f0' }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Admin Dashboard 👑</Text>
        <Text style={styles.subtitle}>Welcome, Boss!</Text>
        <Text style={styles.body}>Here you will be able to create Employee accounts, manage stock, and view invoices.</Text>
        <SignOutButton />
      </View>
    </View>
  );
}

export function EmployeeDashboard() {
  return (
    <View style={[styles.container, { backgroundColor: '#f0fdf4' }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Employee Dashboard 🛠️</Text>
        <Text style={styles.subtitle}>Welcome to work!</Text>
        <Text style={styles.body}>Here you will see your assigned installation sites and submit field reports.</Text>
        <SignOutButton />
      </View>
    </View>
  );
}

export function CustomerDashboard() {
  return (
    <View style={[styles.container, { backgroundColor: '#f0f8ff' }]}>
      <View style={styles.card}>
        <Text style={styles.title}>Customer Dashboard 🛒</Text>
        <Text style={styles.subtitle}>Welcome to Mekha CCTV!</Text>
        <Text style={styles.body}>Here you will be able to request an estimate or a service repair.</Text>
        <SignOutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  subtitle: { fontSize: 18, color: '#666', marginBottom: 20 },
  body: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  signOutButton: { backgroundColor: '#ff4444', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  signOutText: { color: '#fff', fontWeight: 'bold' }
});
