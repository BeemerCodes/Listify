import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { ThemeContext } from "../src/context/ThemeContext";

const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  cinzaFundoEscuro: "#1F2937",
  brancoEscuro: "#2D3748",
  pretoTextoEscuro: "#E5E7EB",
  cinzaTextoEscuro: "#9CA3AF",
};

interface ThemeStyles {
  container: { backgroundColor: string };
  permissionContainer: { backgroundColor: string };
  textoStatus: { color: string };
  button: { backgroundColor: string };
  buttonText: { color: string };
  overlay: { backgroundColor: string };
  textoAjuda: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);

  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: Cores.branco },
      permissionContainer: { backgroundColor: Cores.cinzaFundo },
      textoStatus: { color: Cores.pretoTexto },
      button: { backgroundColor: Cores.roxoPrincipal },
      buttonText: { color: Cores.branco },
      overlay: { backgroundColor: "rgba(0,0,0,0.6)" },
      textoAjuda: { color: Cores.branco },
    },
    dark: {
      container: { backgroundColor: Cores.brancoEscuro },
      permissionContainer: { backgroundColor: Cores.cinzaFundoEscuro },
      textoStatus: { color: Cores.pretoTextoEscuro },
      button: { backgroundColor: Cores.roxoClaro },
      buttonText: { color: Cores.branco },
      overlay: { backgroundColor: "rgba(255,255,255,0.2)" },
      textoAjuda: { color: Cores.pretoTextoEscuro },
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].container,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      paddingTop: Platform.OS === "android" ? 25 : 0,
      ...themeStyles[theme as keyof ThemeStylesMap].permissionContainer,
    },
    textoStatus: {
      textAlign: "center",
      fontSize: 18,
      marginBottom: 20,
      ...themeStyles[theme as keyof ThemeStylesMap].textoStatus,
    },
    button: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].button,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].buttonText,
    },
    overlay: {
      position: "absolute",
      bottom: 100,
      left: 20,
      right: 20,
      borderRadius: 10,
      padding: 15,
      ...themeStyles[theme as keyof ThemeStylesMap].overlay,
    },
    textoAjuda: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].textoAjuda,
    },
  });

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    router.push({ pathname: "/", params: { barcode: data } });
  };

  if (!permission) return <View />;
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
      {isFocused && (
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
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