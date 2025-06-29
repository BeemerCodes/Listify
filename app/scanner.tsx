import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused();

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return; // Previne múltiplos scans
    setScanned(true);

    const PROXY_URL =
      "https://jade-mermaid-cad199.netlify.app/.netlify/functions/proxy";

    try {
      const response = await fetch(`${PROXY_URL}?barcode=${data}`);

      if (!response.ok) {
        // Se a resposta do nosso próprio servidor falhar, avisa o usuário.
        throw new Error(
          `Servidor proxy respondeu com status: ${response.status}`
        );
      }

      const json = await response.json();

      if (json.status === 1 && json.product) {
        const nomeDoProduto =
          json.product.product_name ||
          json.product.generic_name ||
          "Produto sem nome";
        router.push({ pathname: "/", params: { novoItem: nomeDoProduto } });
      } else {
        Alert.alert(
          "Produto não encontrado",
          json.error || "Este código não foi encontrado na base de dados.",
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      console.error("Erro no scanner:", error);
      Alert.alert(
        "Erro de Rede",
        "Não foi possível conectar. Tente novamente.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    }
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
});
