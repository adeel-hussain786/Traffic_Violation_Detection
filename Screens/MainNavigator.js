import React from "react";
import { Image, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

;

import regulationlogo from "./assests/regulation.png";
import locationlogo from "./assests/location.png";
import HomeScreen from "./HomeScreen";
import RegulationsScreen from "./RegulationsScreen";
import TrafficOfficeScreen from "./TrafficOfficeScreen";

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
        tabBarIcon: ({ focused }) => {
          if (route.name === "Home") {
            return (
              <Image
                source={require("./assests/home.png")}
                style={[
                  styles.icon,
                  { tintColor: focused ? "#009688" : "gray" },
                ]}
              />
            );
          }
          if (route.name === "Regulations") {
            return (
              <Image
                source={regulationlogo}
                style={[
                  styles.icon,
                  { tintColor: focused ? "#009688" : "gray" },
                ]}
              />
            );
          }
          if (route.name === "TrafficOffice") {
            return (
              <Image
                source={locationlogo}
                style={[
                  styles.icon,
                  { tintColor: focused ? "#009688" : "gray" },
                ]}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Regulations" component={RegulationsScreen} />
      <Tab.Screen name="TrafficOffice" component={TrafficOfficeScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
});
