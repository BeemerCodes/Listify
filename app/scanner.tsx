// ARQUIVO FINAL SIMPLIFICADO: app/scanner.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const isFocused = useIsFocused(); // Garante que a câmera só rode quando a tela está visível

  // A função agora é muito mais simples
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    // Apenas navega de volta para a tela inicial, passando o código de barras como parâmetro
    router.push({ pathname: "/", params: { barcode: data } });
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.textoStatus}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Button
          onPress={requestPermission}
          title="Conceder Permissão"
          color="#8B5CF6"
        />
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#000" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textoStatus: { textAlign: "center", fontSize: 18, marginBottom: 20 },
  overlay: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 15,
  },
  textoAjuda: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
