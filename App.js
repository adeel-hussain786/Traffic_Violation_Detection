import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./Screens/SplashScreen";
import MainNavigator from "./Screens/MainNavigator";
import LoginScreen from "./Screens/Login_Signup/LoginScreen";
import SignupScreen from "./Screens/Login_Signup/SignupScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signup" component={SignupScreen}/>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Main" component={MainNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
