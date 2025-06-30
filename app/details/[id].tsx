import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react"; // Adiciona useContext
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
import { ThemeContext } from "../../src/context/ThemeContext";
const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  cinzaBorda: "#E5E7EB",
  cinzaFundoEscuro: "#1F2937",
  brancoEscuro: "#2D3748",
  pretoTextoEscuro: "#E5E7EB",
  cinzaTextoEscuro: "#9CA3AF",
};

// Interface para os estilos do tema
interface ThemeStyles {
  container: { backgroundColor: string };
  section: { backgroundColor: string; borderColor: string };
  titulo: { color: string };
  label: { color: string };
  valor: { color: string };
  botao: { backgroundColor: string };
  textoBotao: { color: string };
  imagemPlaceholder: { backgroundColor: string };
  placeholderTexto: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useContext(ThemeContext); // Obtém o tema atual
  const detalhes = params.detalhes ? JSON.parse(params.detalhes as string) : {};

  // Define os estilos para os temas claro e escuro
  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: Cores.cinzaFundo },
      section: { backgroundColor: Cores.branco, borderColor: Cores.cinzaBorda },
      titulo: { color: Cores.pretoTexto },
      label: { color: Cores.pretoTexto },
      valor: { color: Cores.cinzaTexto },
      botao: { backgroundColor: Cores.roxoPrincipal },
      textoBotao: { color: Cores.branco },
      imagemPlaceholder: { backgroundColor: Cores.cinzaBorda },
      placeholderTexto: { color: Cores.cinzaTexto },
    },
    dark: {
      container: { backgroundColor: Cores.cinzaFundoEscuro },
      section: {
        backgroundColor: Cores.brancoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      titulo: { color: Cores.pretoTextoEscuro },
      label: { color: Cores.pretoTextoEscuro },
      valor: { color: Cores.cinzaTextoEscuro },
      botao: { backgroundColor: Cores.roxoClaro },
      textoBotao: { color: Cores.branco },
      imagemPlaceholder: { backgroundColor: Cores.cinzaTextoEscuro },
      placeholderTexto: { color: Cores.cinzaTextoEscuro },
    },
  };

  // Função para formatar nutriments
  const renderNutriments = () => {
    if (!detalhes.nutriments) {
      return (
        <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
          Informações nutricionais não disponíveis
        </Text>
      );
    }
    const { energy_kcal, fat, carbohydrates, proteins } = detalhes.nutriments;
    return (
      <>
        <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
          Calorias: {energy_kcal ? `${energy_kcal} kcal` : "Não disponível"}
        </Text>
        <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
          Gorduras: {fat ? `${fat} g` : "Não disponível"}
        </Text>
        <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
          Carboidratos: {carbohydrates ? `${carbohydrates} g` : "Não disponível"}
        </Text>
        <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
          Proteínas: {proteins ? `${proteins} g` : "Não disponível"}
        </Text>
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles[theme as keyof ThemeStylesMap].container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={[styles.titulo, themeStyles[theme as keyof ThemeStylesMap].titulo]}>
            Detalhes do Produto
          </Text>
        </View>
        <View style={[styles.section, themeStyles[theme as keyof ThemeStylesMap].section]}>
          {detalhes.image_url ? (
            <Image
              source={{ uri: detalhes.image_url }}
              style={styles.imagemProduto}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.imagemPlaceholder, themeStyles[theme as keyof ThemeStylesMap].imagemPlaceholder]}>
              <Text style={[styles.placeholderTexto, themeStyles[theme as keyof ThemeStylesMap].placeholderTexto]}>
                Sem imagem disponível
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.section, themeStyles[theme as keyof ThemeStylesMap].section]}>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Marca:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.brands || "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Nome do Produto:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.product_name_pt ||
              detalhes.product_name_en ||
              detalhes.product_name ||
              "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Nome Genérico:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.generic_name || "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Quantidade:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.quantity || "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Categorias:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.categories || "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Ingredientes:</Text>
          <Text style={[styles.valor, themeStyles[theme as keyof ThemeStylesMap].valor]}>
            {detalhes.ingredients_text || "Não disponível"}
          </Text>
          <Text style={[styles.label, themeStyles[theme as keyof ThemeStylesMap].label]}>Informações Nutricionais:</Text>
          {renderNutriments()}
        </View>
        <Pressable
          style={[styles.botao, themeStyles[theme as keyof ThemeStylesMap].botao]}
          onPress={() => router.back()}
        >
          <Text style={[styles.textoBotao, themeStyles[theme as keyof ThemeStylesMap].textoBotao]}>
            Voltar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: "left",
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
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  valor: {
    fontSize: 16,
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderTexto: {
    fontSize: 16,
  },
  botao: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: "bold",
  },
});