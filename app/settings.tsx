import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  StatusBar, // Importar StatusBar
} from "react-native";
import { ThemeContext } from "../src/context/ThemeContext";
import { Cores } from "../constants/Colors"; // Importar Cores centralizadas

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores; // 'light' ou 'dark'

  // Os estilos agora usarão Cores[currentColorScheme].propriedadeDiretamente
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: Cores[currentColorScheme].background,
    },
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "left",
      color: Cores[currentColorScheme].text,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 15,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: Cores[currentColorScheme].cardBackground,
      borderColor: Cores[currentColorScheme].borderColor,
      shadowColor: "#000", // Sombra pode ser mantida genérica ou ajustada por tema
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      color: Cores[currentColorScheme].text,
    },
    value: {
      fontSize: 16,
      marginBottom: 5,
      color: Cores[currentColorScheme].textSecondary,
    },
    button: {
      marginTop: 15, // Adicionado para espaçamento
      paddingVertical: 15, // Aumentado padding
      borderRadius: 12, // Aumentado borderRadius
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Adicionar StatusBar para consistência com outras telas */}
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={Cores[currentColorScheme].background}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Configurações</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Tema</Text>
        <Text style={styles.value}>
          Tema atual: {theme === "light" ? "Claro" : "Escuro"}
        </Text>
        <Pressable style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>
            Alternar para {theme === "light" ? "Escuro" : "Claro"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
