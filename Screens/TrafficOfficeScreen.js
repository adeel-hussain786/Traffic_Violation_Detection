import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TrafficOfficeScreen() {
  const contacts = [
    { label: "Contact 1", value: "0341-3198882" }, // original number
    { label: "Contact 2", value: "0346-8097360" }, // new number
    { label: "Email", value: "traffic@example.com" }, // updated email
    { label: "Address", value: "Jrwari, Mirpurkhas" }, // updated address
    { label: "Office Hours", value: "Mon-Fri: 9AM - 6PM" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>🏢 Traffic Office</Text>
      {contacts.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3D2E",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#009688",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
