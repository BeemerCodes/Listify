import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
} from "react-native";

const Cores = {
  roxoPrincipal: "#8B5CF6",
  cinzaFundo: "#F3F4F6",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
};

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const detalhes = params.detalhes ? JSON.parse(params.detalhes as string) : {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Detalhes do Produto</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Marca:</Text>
        <Text style={styles.valor}>{detalhes.brands || "Não disponível"}</Text>
        <Text style={styles.label}>Nome do Produto:</Text>
        <Text style={styles.valor}>
          {detalhes.product_name_pt ||
            detalhes.product_name_en ||
            detalhes.product_name ||
            "Não disponível"}
        </Text>
        <Text style={styles.label}>Nome Genérico:</Text>
        <Text style={styles.valor}>
          {detalhes.generic_name || "Não disponível"}
        </Text>
        <Text style={styles.label}>Quantidade:</Text>
        <Text style={styles.valor}>
          {detalhes.quantity || "Não disponível"}
        </Text>
        <Text style={styles.label}>Ingredientes:</Text>
        <Text style={styles.valor}>
          {detalhes.ingredients_text || "Não disponível"}
        </Text>
      </View>
      <Pressable style={styles.botao} onPress={() => router.back()}>
        <Text style={styles.textoBotao}>Voltar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.cinzaFundo,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: Cores.pretoTexto,
    textAlign: "left",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Cores.pretoTexto,
    marginTop: 15,
  },
  valor: {
    fontSize: 16,
    color: Cores.cinzaTexto,
    marginBottom: 10,
  },
  botao: {
    margin: 20,
    padding: 15,
    backgroundColor: Cores.roxoPrincipal,
    borderRadius: 12,
    alignItems: "center",
  },
  textoBotao: {
    color: Cores.branco,
    fontSize: 18,
    fontWeight: "bold",
  },
});
