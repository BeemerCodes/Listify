import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react"; // Adicionado useEffect e useState
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { ThemeContext } from "../src/context/ThemeContext";
import { Cores } from "../constants/Colors"; // Importar Cores Centralizadas

// Removida a constante Cores local, pois usaremos a importada

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setScanned(false); // Permite novo scan quando a tela ganha foco
    }
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: Cores[currentColorScheme].background,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      paddingTop: Platform.OS === "android" ? 25 : 0,
      backgroundColor: Cores[currentColorScheme].background,
    },
    textoStatus: {
      textAlign: "center",
      fontSize: 18,
      marginBottom: 20,
      color: Cores[currentColorScheme].text,
    },
    button: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
    overlay: {
      position: "absolute",
      bottom: 100,
      left: 20,
      right: 20,
      borderRadius: 10,
      padding: 15,
      backgroundColor: theme === 'light' ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.2)",
    },
    textoAjuda: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      color: theme === 'light' ? Cores.light.cardBackground : Cores.dark.text, // Ajustar cor para melhor contraste no overlay
    },
  });

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) {
      return;
    }
    setScanned(true);
    console.log("Código de barras detectado [scanner.tsx]:", data);
    router.push({ pathname: "/", params: { barcode: data } });
  };

  if (!permission) return (
    <View style={styles.permissionContainer}>
        <Text style={styles.textoStatus}>Aguardando permissão da câmera...</Text>
    </View>
  );

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.textoStatus}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && permission.granted && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13", 
              "ean8", 
              "upc_a", 
              "upc_e", 
              "qr",
              "code128", 
              "code39",  
              "codabar",
              "itf", // Para ITF-14 e similares
              // Adicione outros tipos se necessário, como "datamatrix", "pdf417"
            ], 
          }}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.textoAjuda}>
          Aponte a câmera para um código de barras
        </Text>
      </View>
    </View>
  );
}