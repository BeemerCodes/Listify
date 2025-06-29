import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
} from "react-native";
import { ThemeContext } from "../src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  cinzaInput: "#E5E7EB",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  vermelhoExcluir: "#EF4444",
  cinzaFundoEscuro: "#1F2937",
  brancoEscuro: "#2D3748",
  pretoTextoEscuro: "#E5E7EB",
  cinzaTextoEscuro: "#9CA3AF",
};

interface ThemeStyles {
  container: { backgroundColor: string };
  section: { backgroundColor: string; borderColor: string };
  title: { color: string };
  label: { color: string };
  value: { color: string };
  button: { backgroundColor: string };
  buttonText: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: Cores.cinzaFundo },
      section: { backgroundColor: Cores.branco, borderColor: Cores.cinzaInput },
      title: { color: Cores.pretoTexto },
      label: { color: Cores.pretoTexto },
      value: { color: Cores.cinzaTexto },
      button: { backgroundColor: Cores.roxoPrincipal },
      buttonText: { color: Cores.branco },
    },
    dark: {
      container: { backgroundColor: Cores.cinzaFundoEscuro },
      section: {
        backgroundColor: Cores.brancoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      title: { color: Cores.pretoTextoEscuro },
      label: { color: Cores.pretoTextoEscuro },
      value: { color: Cores.cinzaTextoEscuro },
      button: { backgroundColor: Cores.roxoClaro },
      buttonText: { color: Cores.branco },
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? 25 : 0,
      ...themeStyles[theme as keyof ThemeStylesMap].container,
    },
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "left",
      ...themeStyles[theme as keyof ThemeStylesMap].title,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 15,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      ...themeStyles[theme as keyof ThemeStylesMap].section,
    },
    label: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      ...themeStyles[theme as keyof ThemeStylesMap].label,
    },
    value: {
      fontSize: 16,
      marginBottom: 5,
      ...themeStyles[theme as keyof ThemeStylesMap].value,
    },
    button: {
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].button,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].buttonText,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
