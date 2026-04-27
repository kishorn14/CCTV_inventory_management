import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }: any) {
  const [tab, setTab] = useState<'customer' | 'employee' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if there was an error stored before the component unmounted
    AsyncStorage.getItem('login_error').then(err => {
      if (err) {
        setErrorMsg(err);
        AsyncStorage.removeItem('login_error'); // Clear it after reading
      }
    });
  }, []);

  async function handleSignIn() {
    setErrorMsg('');
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile && profile.role !== tab) {
        // Save the error so it survives the unmount/remount cycle
        await AsyncStorage.setItem('login_error', `Access denied. You are not registered as an ${tab}.`);
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }
    }
    
    setLoading(false);
  }

  async function handleCustomerSignUp() {
    if (tab !== 'customer') return;
    setErrorMsg('');
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigation.navigate('OTP', { email });
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Mekha CCTV Solutions</Text>
        
        {/* TABS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, tab === 'customer' && styles.activeTab]} 
            onPress={() => { setTab('customer'); setErrorMsg(''); }}>
            <Text style={[styles.tabText, tab === 'customer' && styles.activeTabText]}>Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, tab === 'employee' && styles.activeTab]} 
            onPress={() => { setTab('employee'); setErrorMsg(''); }}>
            <Text style={[styles.tabText, tab === 'employee' && styles.activeTabText]}>Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, tab === 'admin' && styles.activeTab]} 
            onPress={() => { setTab('admin'); setErrorMsg(''); }}>
            <Text style={[styles.tabText, tab === 'admin' && styles.activeTabText]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          {tab === 'customer' ? 'Login or Create an Account' : `Login as ${tab === 'admin' ? 'Admin' : 'Employee'}`}
        </Text>

        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        {tab === 'customer' && (
          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={handleCustomerSignUp} disabled={loading}>
            <Text style={styles.buttonOutlineText}>Create Customer Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', padding: 20 },
  innerContainer: { width: '100%', maxWidth: 400, alignSelf: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1a1a1a' },
  tabContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, backgroundColor: '#f0f0f0', padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { color: '#666', fontWeight: 'bold' },
  activeTabText: { color: '#0066cc' },
  subtitle: { textAlign: 'center', marginBottom: 20, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 16, backgroundColor: '#fafafa' },
  button: { backgroundColor: '#0066cc', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#0066cc' },
  buttonOutlineText: { color: '#0066cc', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#ff3333', textAlign: 'center', marginBottom: 15, fontWeight: 'bold' }
});
