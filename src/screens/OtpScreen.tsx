import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function OtpScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerifyOtp() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    });

    if (error) {
      alert('Invalid code. Please try again.');
    } 
    // If successful, App.tsx will automatically detect the new session and redirect!
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>We sent a 6-digit verification code to:</Text>
        <Text style={styles.emailText}>{email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={8}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  innerContainer: { width: '100%', maxWidth: 400, alignSelf: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666' },
  emailText: { textAlign: 'center', fontWeight: 'bold', color: '#0066cc', marginBottom: 30, marginTop: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 20, textAlign: 'center', letterSpacing: 5, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#0066cc', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backButton: { marginTop: 20, alignItems: 'center' },
  backButtonText: { color: '#666', fontSize: 14 }
});
