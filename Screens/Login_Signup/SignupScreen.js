import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth'

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#00695C'); 

  function signup() {
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      setMessageColor('#009688');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setMessageColor('#009688');
      return;
    }
          const auth=getAuth();
   
      createUserWithEmailAndPassword(auth,email, password)
      .then(() => {
        console.log('Signup Successful');
        setMessage('✅ Account created!');
        setMessageColor('#00695C');

        setTimeout(() => {
          navigation.replace('Main');
        }, 2000);
      })
      .catch(error => {
        console.log('signup error', error.message);
        setMessage(`⚠️ ${error.message}`);
        setMessageColor('#009688');
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <TouchableOpacity style={styles.button} onPress={signup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
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
  loginText: {
    color: '#607D8B',
    fontSize: 15,
  },
  loginLink: {
    color: '#009688',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
