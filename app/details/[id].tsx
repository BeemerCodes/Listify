import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
  Image,
} from "react-native";

const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  cinzaBorda: "#E5E7EB",
};

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const detalhes = params.detalhes ? JSON.parse(params.detalhes as string) : {};

  // Função para formatar nutriments (se disponíveis)
  const renderNutriments = () => {
    if (!detalhes.nutriments) {
      return (
        <Text style={styles.valor}>
          Informações nutricionais não disponíveis
        </Text>
      );
    }
    const { energy_kcal, fat, carbohydrates, proteins } = detalhes.nutriments;
    return (
      <>
        <Text style={styles.valor}>
          Calorias: {energy_kcal ? `${energy_kcal} kcal` : "Não disponível"}
        </Text>
        <Text style={styles.valor}>
          Gorduras: {fat ? `${fat} g` : "Não disponível"}
        </Text>
        <Text style={styles.valor}>
          Carboidratos:{" "}
          {carbohydrates ? `${carbohydrates} g` : "Não disponível"}
        </Text>
        <Text style={styles.valor}>
          Proteínas: {proteins ? `${proteins} g` : "Não disponível"}
        </Text>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.titulo}>Detalhes do Produto</Text>
        </View>
        <View style={styles.section}>
          {detalhes.image_url ? (
            <Image
              source={{ uri: detalhes.image_url }}
              style={styles.imagemProduto}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagemPlaceholder}>
              <Text style={styles.placeholderTexto}>Sem imagem disponível</Text>
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Marca:</Text>
          <Text style={styles.valor}>
            {detalhes.brands || "Não disponível"}
          </Text>
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
          <Text style={styles.label}>Categorias:</Text>
          <Text style={styles.valor}>
            {detalhes.categories || "Não disponível"}
          </Text>
          <Text style={styles.label}>Ingredientes:</Text>
          <Text style={styles.valor}>
            {detalhes.ingredients_text || "Não disponível"}
          </Text>
          <Text style={styles.label}>Informações Nutricionais:</Text>
          {renderNutriments()}
        </View>
        <Pressable style={styles.botao} onPress={() => router.back()}>
          <Text style={styles.textoBotao}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.cinzaFundo,
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  scrollContent: {
    paddingBottom: 20,
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
  section: {
    backgroundColor: Cores.branco,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cores.cinzaBorda,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: Cores.pretoTexto,
    marginTop: 10,
  },
  valor: {
    fontSize: 16,
    color: Cores.cinzaTexto,
    marginBottom: 5,
  },
  imagemProduto: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  imagemPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: Cores.cinzaBorda,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderTexto: {
    fontSize: 16,
    color: Cores.cinzaTexto,
  },
  botao: {
    marginHorizontal: 20,
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
