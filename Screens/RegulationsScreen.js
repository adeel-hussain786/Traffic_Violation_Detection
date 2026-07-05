import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function RegulationsScreen() {
  const rules = [
    "Always wear a helmet.",
    "Don’t overspeed.",
    "Follow traffic signals.",
    "Avoid mobile phone while driving.",
    "Use seat belts at all times.",
    "Do not drink and drive.",
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>🚦 Traffic Rules & Regulations</Text>
      {rules.map((rule, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.ruleNumber}>{index + 1}</Text>
          <Text style={styles.ruleText}>{rule}</Text>
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
    flexDirection: "row",
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
  ruleNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
    marginRight: 10,
  },
  ruleText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
});
