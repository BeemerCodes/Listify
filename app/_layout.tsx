import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ListProvider } from "../src/context/ListContext";
import { ThemeContext, ThemeProvider } from "../src/context/ThemeContext";
import { useColorScheme } from "react-native";

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
  tabBarActiveTintColor: string;
  tabBarInactiveTintColor: string;
  tabBarStyle: {
    backgroundColor: string;
    borderTopColor: string;
    borderTopWidth: number;
    shadowOpacity: number;
    elevation: number;
  };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function RootLayout() {
  const { theme } = useContext(ThemeContext) || {
    theme: useColorScheme() || "light",
  };

  const themeStyles: ThemeStylesMap = {
    light: {
      tabBarActiveTintColor: Cores.roxoPrincipal,
      tabBarInactiveTintColor: Cores.cinzaTexto,
      tabBarStyle: {
        backgroundColor: Cores.branco,
        borderTopColor: Cores.cinzaInput,
        borderTopWidth: 1,
        shadowOpacity: 0.1,
        elevation: 3,
      },
    },
    dark: {
      tabBarActiveTintColor: Cores.roxoClaro,
      tabBarInactiveTintColor: Cores.cinzaTextoEscuro,
      tabBarStyle: {
        backgroundColor: Cores.cinzaFundoEscuro,
        borderTopColor: Cores.cinzaTextoEscuro,
        borderTopWidth: 1,
        shadowOpacity: 0.1,
        elevation: 3,
      },
    },
  };

  return (
    <ListProvider>
      <ThemeProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor:
              themeStyles[theme as keyof ThemeStylesMap].tabBarActiveTintColor,
            tabBarInactiveTintColor:
              themeStyles[theme as keyof ThemeStylesMap]
                .tabBarInactiveTintColor,
            tabBarStyle: themeStyles[theme as keyof ThemeStylesMap].tabBarStyle,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Lista Atual",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="cart-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="scanner"
            options={{
              title: "Scanner",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="barcode-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="lists"
            options={{
              title: "Minhas Listas",
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name="file-tray-full-outline"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Configurações",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="+not-found"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="details/[id]"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </ThemeProvider>
    </ListProvider>
  );
}
