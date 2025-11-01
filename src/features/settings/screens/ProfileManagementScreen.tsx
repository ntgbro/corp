import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SettingsSection } from '../components/SettingsSection';

export const ProfileManagementScreen = () => {
  const { colors } = useTheme();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
  });

  const handleSave = () => {
    // TODO: Implement save to backend
    setEditing(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setEditing(!editing)}>
          <Text style={styles.editButtonText}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      <SettingsSection title="Personal Information">
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text + '80' }]}>Full Name</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{profile.name}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text + '80' }]}>Email</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{profile.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text + '80' }]}>Phone Number</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{profile.phone}</Text>
          )}
        </View>
      </SettingsSection>

      {editing && (
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    padding: 0,
    paddingVertical: 4,
    borderBottomWidth: 1,
  },
  saveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
