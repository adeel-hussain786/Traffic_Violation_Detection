import React, {useState} from 'react';
import {Text, View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';


const LoginScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#00695C'); 
  const auth=getAuth();

  function login() {
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      setMessageColor('#009688');
      return;
    }

    signInWithEmailAndPassword(auth,email, password)
      .then(() => {
        setMessage('✅ Login Successful!');
        setMessageColor('#00695C');
        console.log('Successful');

        setTimeout(() => {
          navigation.replace('Main'); 
        }, 2000);
      })
      .catch(error => {
        console.log('login error', error.message);
        setMessage(`⚠️ ${error.message}`);
        setMessageColor('#009688');
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="Enter Email"
        placeholderTextColor="#607D8B"
        onChangeText={text => setEmail(text)}
        value={email}
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Password"
        placeholderTextColor="#607D8B"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
        style={styles.input}
      />

      {message !== '' && (
        <Text style={[styles.message, {color: messageColor}]}>{message}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#004D40',
    marginBottom: 40,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#009688',
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#004D40',
  },
  message: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    width: '90%',
    backgroundColor: '#009688',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    color: '#607D8B',
    fontSize: 15,
  },
  signupLink: {
    color: '#009688',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
