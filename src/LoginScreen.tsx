import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Function to split text into an array of letters
const splitTextIntoLetters = (text: string) => text.split('');

// Function to create animations for each letter
const createAnimations = (text: string) => {
  return splitTextIntoLetters(text).map((_, index) => {
    const animation = new Animated.Value(-300); // Start position above the screen
    Animated.timing(animation, {
      toValue: 0, // End position
      duration: 1500,
      delay: index * 100, // Staggered delay
      useNativeDriver: true,
    }).start();
    return animation;
  });
};

// Function to generate a random CAPTCHA code of a given length
const generateCaptcha = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    captcha += characters[randomIndex];
  }
  return captcha;
};

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const text = "Login";
  const animations = useState(createAnimations(text))[0];
  const [captcha, setCaptcha] = useState(generateCaptcha(4));
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState<string>(''); // Declare and initialize email
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    // Refresh CAPTCHA when the component mounts
    setCaptcha(generateCaptcha(4));
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha(4));
  };

  const handleCaptchaChange = (text: string) => {
    setEnteredCaptcha(text);
    if (text === captcha) {
      setIsCaptchaValid(true);
      setErrorMessage('');
    } else {
      setIsCaptchaValid(false);
      setErrorMessage('Incorrect CAPTCHA');
    }
  };

  const handleLogin = async () => {
    if (enteredCaptcha === captcha) {
      try {
        const response = await axios.post('http://192.168.1.5:3000/auth/login', { email, password });
        const { token } = response.data;
        // Store token and navigate to Profile screen
        console.log('Login successful:', token); // Debug statement
        navigation.navigate('Profile');
      } catch (error) {
        // Type error handling
        if (axios.isAxiosError(error)) {
          console.error('Login error:', error.response?.data?.error || error.message); // Debug statement
          setErrorMessage('Invalid credentials');
        } else {
          console.error('Unexpected error:', error); // Debug statement
          setErrorMessage('An unexpected error occurred');
        }
      }
    } else {
      setIsCaptchaValid(false);
      setErrorMessage('Incorrect CAPTCHA');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {splitTextIntoLetters(text).map((letter, index) => (
          <Animated.Text
            key={index}
            style={[styles.title, {
              transform: [{ translateY: animations[index] }],
            }]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="envelope" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Email" 
            placeholderTextColor="#000" 
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={30} color="#000" style={styles.icon} />
          <TextInput 
            style={styles.input}
            placeholder="Password" 
            placeholderTextColor="#000" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput 
            style={[styles.input, !isCaptchaValid && styles.inputError]} 
            placeholder="Enter CAPTCHA" 
            placeholderTextColor="#000" 
            value={enteredCaptcha}
            onChangeText={handleCaptchaChange}
          />
          <Text style={styles.captchaText}>{captcha}</Text>
          <TouchableOpacity onPress={refreshCaptcha} style={styles.refreshButton}>
            <Icon name="refresh" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        {!isCaptchaValid && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor:'#f7f5f5'
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Set border width for all sides
    borderColor: '#2e2d2d', // Set the border color
    borderRadius: 4, 
  },
  input: {
    backgroundColor: '#f7f5f5',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#000000',
    fontSize: 15,
    flex:1,
    width:'100%'
  },
  inputError: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Set border width for all sides
    borderColor: '#f80808', // Set the border color
    borderRadius: 4, 
  },
  button: {
    backgroundColor: '#050505',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  refreshButton: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  captchaText: {
    position: 'absolute',
    right: 60,
    top: 15,
    color: '#060606',
    fontSize: 20,
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    color: '#0a0a0a',
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: 'Bazooka',
  },
});

export default LoginScreen;
