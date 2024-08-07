import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, TextInput, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configure the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [reminderText, setReminderText] = useState('');
  const [reminderTime, setReminderTime] = useState(0); // Time in seconds

  useEffect(() => {
    const askForPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant notification permissions!');
      }
    };
    askForPermissions();
  }, []);

  const playSoundOnly = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Sound Notification",
          body: 'This is a sound-only notification!',
          sound: 'default', // Play the default sound
        },
        trigger: null, // Immediate notification
      });
      Alert.alert('Sound Notification', 'Sound-only notification played.');
    } catch (error) {
      console.error('Error scheduling sound-only notification:', error);
      Alert.alert('Error', 'Failed to play the sound-only notification.');
    }
  };

  const scheduleReminder = async () => {
    if (!reminderText || reminderTime <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid reminder text and time.');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminderText,
          badge: 1,
          sound: 'default', // Play the default sound
        },
        trigger: { seconds: reminderTime }, // Trigger after `reminderTime` seconds
      });

      Alert.alert('Reminder Set', `Your reminder will be triggered in ${reminderTime} seconds.`);
    } catch (error) {
      console.error('Error scheduling reminder notification:', error);
      Alert.alert('Error', 'Failed to set the reminder notification.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter reminder text"
        value={reminderText}
        onChangeText={setReminderText}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter time in seconds"
        keyboardType="numeric"
        value={String(reminderTime)}
        onChangeText={(text) => setReminderTime(Number(text))}
      />
      <Button title="Play Sound Only" onPress={playSoundOnly} />
      <Button title="Set Reminder" onPress={scheduleReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
  },
});
