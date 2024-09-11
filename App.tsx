import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './src/SplashScreen';
import LoginScreen from './src/LoginScreen';
import SignupScreen from './src/SignupScreen';
import Profile from './src/Profile';
import ChatScreen from './src/ChatScreen'; // Import your chat screens
import ChatScreen2 from './src/ChatScreen';
import ChatScreen3 from './src/ChatScreen';
import ChatScreen4 from './src/ChatScreen';
import { ProfileProvider } from './src/ProfileContext'; 
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import CustomDrawerContent from './src/CustomDrawerContent';
import { Text, Button, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define type for DrawerNavigator's navigation prop
type DrawerParamList = {
  Profile: undefined;
  BNS: undefined;
  BNSS: undefined;
  BSB: undefined;
  Counselling: undefined;
  OnlineConsultation: undefined;
  InPersonConsultation: undefined;
  ChatScreen: undefined;
  ChatScreen2: undefined;
  ChatScreen3: undefined;
  ChatScreen4: undefined;
};

type DrawerScreenProps = DrawerNavigationProp<DrawerParamList>;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }: { navigation: DrawerScreenProps }) => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent photoUri={null} {...props} />}
  >
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="BNS" component={() => (
      <View>
        <Button title="Go to Chat Screen" onPress={() => navigation.navigate('ChatScreen')} />
      </View>
    )} />
    <Drawer.Screen name="BNSS" component={() => (
      <View>
        <Button title="Go to Chat Screen 2" onPress={() => navigation.navigate('ChatScreen2')} />
      </View>
    )} />
    <Drawer.Screen name="BSB" component={() => (
      <View>
        <Button title="Go to Chat Screen 3" onPress={() => navigation.navigate('ChatScreen3')} />
      </View>
    )} />
    <Drawer.Screen name="Counselling" component={() => (
      <View>
        <Button title="Go to Chat Screen 4" onPress={() => navigation.navigate('ChatScreen4')} />
      </View>
    )} />
    <Drawer.Screen name="Online Consultation" component={() => (
      <View>
        <Button title="Go to Chat Screen 5" onPress={() => navigation.navigate('ChatScreen')} />
      </View>
    )} />
    <Drawer.Screen name="In Person Consultation" component={() => (
      <View>
        <Button title="Go to Chat Screen 6" onPress={() => navigation.navigate('ChatScreen')} />
      </View>
    )} />
    <Drawer.Screen name="ChatScreen" component={ChatScreen} />
    <Drawer.Screen name="ChatScreen2" component={ChatScreen2} />
    <Drawer.Screen name="ChatScreen3" component={ChatScreen3} />
    <Drawer.Screen name="ChatScreen4" component={ChatScreen4} />
  </Drawer.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null; // or a loading spinner
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? "Profile" : "Splash"}>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Profile"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
};

export default App;
