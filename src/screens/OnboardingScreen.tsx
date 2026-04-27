import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUserId(session.user.id);
    });
  }, []);

  async function saveProfile() {
    if (!name || !phone || !location) {
      alert("Please fill out all fields!");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name, phone, location })
      .eq('id', userId);

    if (error) {
      alert(error.message);
    } else {
      // Force session refresh to trigger App.tsx routing
      const { data } = await supabase.auth.getSession();
      supabase.auth.refreshSession();
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Let's finish setting up your account.</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Location (City or Village)"
          value={location}
          onChangeText={setLocation}
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Complete Setup</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  innerContainer: { width: '100%', maxWidth: 400, alignSelf: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#1a1a1a' },
  subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#28a745', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
