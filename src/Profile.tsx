import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import axios from 'axios'; // Add axios import
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing token

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null); // State for user data
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Retrieve token from AsyncStorage
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://192.168.1.5:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response: ImagePickerResponse) => {
      if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
        const selectedPhotoUri = response.assets[0].uri ?? null;
        setPhotoUri(selectedPhotoUri);

        // Optionally, send the photo to the backend
        const token = await AsyncStorage.getItem('token');
        if (token && selectedPhotoUri) {
          const formData = new FormData();
          formData.append('profilePhoto', {
            uri: selectedPhotoUri,
            type: 'image/jpeg', // Adjust type based on your image format
            name: 'profilePhoto.jpg',
          });

          try {
            await axios.post('http://192.168.1.5:3000/auth/upload-photo', formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            });
          } catch (error) {
            console.error('Failed to upload photo:', error);
          }
        }
      }
    });
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    return nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const initials = getInitials(user.name);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleChoosePhoto}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.profilePicture} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.viewProfile}>Tap to change photo</Text>
      </View>

      <View style={styles.userDetails}>
        <Text style={styles.userDetail}>Salutation: {user.salutation}</Text>
        <Text style={styles.userDetail}>Name: {user.name}</Text>
        <Text style={styles.userDetail}>Email: {user.email}</Text>
        <Text style={styles.userDetail}>Phone: {user.phone}</Text>
        <Text style={styles.userDetail}>Address: {user.address}</Text>
      </View>
    </View>
  );
};

// Styles for the ProfilePage component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  initialsContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  initials: {
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  viewProfile: {
    fontSize: 14,
    color: '#007BFF',
    marginTop: 10,
  },
  userDetails: {
    width: '100%',
    paddingHorizontal: 20,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 12,
    color: '#333',
  },
});

export default ProfilePage;
