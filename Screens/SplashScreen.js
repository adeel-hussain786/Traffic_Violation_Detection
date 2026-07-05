import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, StatusBar } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
   
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

 
    const animateDots = () => {
      dots.forEach((dot, i) => {
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    };
    const interval = setInterval(animateDots, 1000);
    animateDots(); // initial call

    const timeout = setTimeout(() => navigation.replace('Signup'), 4500);

    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <Animated.Image source={require('./assests/Logo.png')} style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} resizeMode="contain" />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>TrafficScan</Animated.Text>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}> AI-powered automatic traffic rule monitoring</Animated.Text>

      <View style={styles.loader}>
        {dots.map((dot, i) => <Animated.View key={i} style={[styles.dot, { opacity: dot }]} />)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 140, height: 140, marginBottom: 15 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#009688', letterSpacing: 1.5 },
  tagline: { fontSize: 16, color: '#607D8B', marginTop: 5, fontWeight: '500' },
  loader: { flexDirection: 'row', marginTop: 25 },
  dot: { width: 10, height: 10, backgroundColor: '#009688', borderRadius: 5, marginHorizontal: 5 },
});

export default SplashScreen;
