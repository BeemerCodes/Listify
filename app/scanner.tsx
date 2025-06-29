import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";

export default function ScannerScreen() {
  // O novo hook que gerencia o estado da permissão
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const router = useRouter();

  useEffect(() => {
    if (isFocused) {
      // Reseta o estado do scanner toda vez que a tela entra em foco
      setScanned(false);
    }
  }, [isFocused]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    setLoading(true);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${data}.json`
      );
      const json = await response.json();

      if (json.status === 1) {
        const nomeDoProduto = json.product.product_name || "Produto sem nome";
        router.push({ pathname: "/", params: { novoItem: nomeDoProduto } });
      } else {
        Alert.alert(
          "Produto não encontrado",
          "Este código de barras não foi encontrado na base de dados.",
          [{ text: "OK", onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erro de Rede",
        "Não foi possível conectar à base de dados de produtos.",
        [{ text: "OK", onPress: () => setScanned(false) }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Verifica se o status da permissão já foi determinado
  if (!permission) {
    return <View />; // Ou um spinner de carregamento inicial
  }

  // Se a permissão não foi concedida, mostra uma mensagem e um botão para pedir
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

  // Se a permissão foi concedida, mostra a câmera
  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {loading && <ActivityIndicator size="large" color="#8B5CF6" />}
      <View style={styles.overlay}>
        <Text style={styles.textoAjuda}>
          Aponte a câmera para um código de barras
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  textoStatus: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    color: "#1F2937",
  },
  overlay: {
    position: "absolute",
    bottom: 100, // Aumentado para não ficar em cima das abas
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
