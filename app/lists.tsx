// NOVO ARQUIVO: app/lists.tsx
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function ListsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Listas</Text>
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Em breve, aqui você poderá criar, renomear e gerenciar todas as suas
          listas de compras!
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F2937",
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7281",
    textAlign: "center",
  },
});
