import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ListProvider } from "../src/context/ListContext";
import { ThemeContext, ThemeProvider } from "../src/context/ThemeContext";
import { Cores } from "../constants/Colors"; // Importar Cores centralizadas
import { View } from "react-native"; // Necessário para o componente de loading
// import Toast from 'react-native-toast-message'; // Garantir que esta linha seja removida ou comentada
// import { toastConfig } from '../src/utils/toastService'; // Esta já deve estar removida

function TabsLayout() {
  const { theme, isLoadingTheme } = useContext(ThemeContext); // Adicionado isLoadingTheme
  const currentColorScheme = theme as keyof typeof Cores;

  // Se o tema ainda está carregando, pode-se retornar um placeholder ou null
  // para evitar que a UI da Tab pisque com o tema errado.
  if (isLoadingTheme) {
    // Você pode retornar um componente de splash screen/loading aqui se desejar
    // ou null para não renderizar nada até o tema estar pronto.
    // Por simplicidade, um View vazio ou null.
    return <View style={{flex: 1, backgroundColor: Cores[currentColorScheme].background }} />;
    // Alternativamente, para evitar qualquer renderização antes do tema:
    // return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Cores[currentColorScheme].tabIconSelected,
        tabBarInactiveTintColor: Cores[currentColorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Cores[currentColorScheme].cardBackground, // Usar cardBackground para a tab bar
          borderTopColor: Cores[currentColorScheme].borderColor,
          borderTopWidth: 1,
          shadowOpacity: 0.1, // Pode ser ajustado ou removido se o design for mais flat
          elevation: 3, // Pode ser ajustado ou removido
        },
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
            <Ionicons name="file-tray-full-outline" size={size} color={color} />
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
      {/* Telas ocultas */}
      <Tabs.Screen name="+not-found" options={{ href: null }} />
      <Tabs.Screen name="details/[id]" options={{ href: null }}/>
    </Tabs>
  );
}

export default function RootLayout() {
  // ThemeProvider já está aqui, o que é bom.
  // ListProvider também está aqui.
  return (
    <ThemeProvider>
      <ListProvider>
        <TabsLayout />
        <Toast config={toastConfig} /> {/* Passar o config aqui */}
      </ListProvider>
    </ThemeProvider>
  );
}