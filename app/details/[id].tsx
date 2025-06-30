import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  Platform,
  ScrollView,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { ThemeContext } from "../../src/context/ThemeContext";
import { ListContext, Item } from "../../src/context/ListContext";
import { Cores as GlobalCores } from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";

interface ThemeStyles {
  container: { backgroundColor: string };
  section: { backgroundColor: string; borderColor: string };
  titulo: { color: string };
  label: { color: string };
  valor: { color: string };
  input: { backgroundColor: string; color: string; borderColor: string; placeholderTextColor: string;};
  botaoSalvar: { backgroundColor: string };
  botaoVoltar: { backgroundColor: string };
  textoBotaoSalvar: { color: string };
  textoBotaoVoltar: { color: string };
  imagemPlaceholder: { backgroundColor: string };
  placeholderTexto: { color: string };
  totalItemText: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function ProductDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { todasAsListas, setTodasAsListas } = useContext(ListContext);

  const itemId = params.id as string;
  const openFoodFactsDetalhesJSON = params.itemDetalhesJSON as string | undefined;
  const openFoodFactsDetalhes = openFoodFactsDetalhesJSON
    ? JSON.parse(openFoodFactsDetalhesJSON)
    : null;

  const [itemEditavel, setItemEditavel] = useState<Item | null>(null);
  const [nomeEditavel, setNomeEditavel] = useState("");
  const [valorUnitarioEditavel, setValorUnitarioEditavel] = useState("");
  const [valorTotalCalculado, setValorTotalCalculado] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isListaTarefasDetalhes, setIsListaTarefasDetalhes] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let foundItem: Item | undefined;
    let nomeDaListaDoItem = "";

    for (const lista of todasAsListas) {
      foundItem = lista.itens.find((i) => i.id === itemId);
      if (foundItem) {
        nomeDaListaDoItem = lista.nome;
        break;
      }
    }

    if (foundItem) {
      setItemEditavel(foundItem);
      setNomeEditavel(foundItem.texto);
      setValorUnitarioEditavel(foundItem.valorUnitario?.toString().replace(".", ",") || "");
      setIsListaTarefasDetalhes(nomeDaListaDoItem.toLowerCase() === "tarefas");
    } else if (!openFoodFactsDetalhes) {
      Alert.alert("Erro", "Item não encontrado.", [{ text: "OK", onPress: () => router.back() }]);
    }
    setIsLoading(false);
  }, [itemId, todasAsListas, router, openFoodFactsDetalhes]);

  useEffect(() => {
    const quantidade = itemEditavel?.quantidade || 0;
    const valorUnit = parseFloat(valorUnitarioEditavel.replace(",", ".")) || 0;
    setValorTotalCalculado(quantidade * valorUnit);
  }, [valorUnitarioEditavel, itemEditavel?.quantidade]);

  const isDarkTheme = theme === "dark";

  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: GlobalCores.cinzaFundo },
      section: { backgroundColor: GlobalCores.branco, borderColor: GlobalCores.cinzaInput },
      titulo: { color: GlobalCores.pretoTexto },
      label: { color: GlobalCores.pretoTexto },
      valor: { color: GlobalCores.cinzaTexto },
      input: {
        backgroundColor: GlobalCores.branco,
        color: GlobalCores.pretoTexto,
        borderColor: GlobalCores.cinzaInput,
        placeholderTextColor: GlobalCores.cinzaTexto,
      },
      botaoSalvar: { backgroundColor: GlobalCores.roxoPrincipal },
      botaoVoltar: { backgroundColor: GlobalCores.cinzaInput },
      textoBotaoSalvar: { color: GlobalCores.branco },
      textoBotaoVoltar: { color: GlobalCores.pretoTexto },
      imagemPlaceholder: { backgroundColor: GlobalCores.cinzaInput },
      placeholderTexto: { color: GlobalCores.cinzaTexto },
      totalItemText: { color: GlobalCores.pretoTexto },
    },
    dark: {
      container: { backgroundColor: GlobalCores.cinzaFundoEscuro },
      section: {
        backgroundColor: GlobalCores.brancoEscuro,
        borderColor: GlobalCores.cinzaTextoEscuro,
      },
      titulo: { color: GlobalCores.pretoTextoEscuro },
      label: { color: GlobalCores.pretoTextoEscuro },
      valor: { color: GlobalCores.cinzaTextoEscuro },
      input: {
        backgroundColor: GlobalCores.cinzaInput, 
        color: GlobalCores.pretoTextoEscuro,
        borderColor: GlobalCores.cinzaTextoEscuro,
        placeholderTextColor: GlobalCores.cinzaTextoEscuro,
      },
      botaoSalvar: { backgroundColor: GlobalCores.roxoClaro },
      botaoVoltar: { backgroundColor: GlobalCores.cinzaTextoEscuro },
      textoBotaoSalvar: { color: GlobalCores.branco },
      textoBotaoVoltar: { color: GlobalCores.pretoTextoEscuro },
      imagemPlaceholder: { backgroundColor: GlobalCores.cinzaTextoEscuro },
      placeholderTexto: { color: GlobalCores.cinzaTextoEscuro },
      totalItemText: { color: GlobalCores.pretoTextoEscuro },
    },
  };
  
  const currentThemeStyles = themeStyles[theme as keyof ThemeStylesMap];

  const handleSaveChanges = () => {
    if (!itemEditavel) return;
    const novoValorUnitario = parseFloat(valorUnitarioEditavel.replace(",", ".")) || 0;
    const updatedItem: Item = {
      ...itemEditavel,
      texto: nomeEditavel.trim(),
      valorUnitario: novoValorUnitario,
      valorTotalItem: (itemEditavel.quantidade || 0) * novoValorUnitario,
    };
    const newListas = todasAsListas.map((lista) => ({
      ...lista,
      itens: lista.itens.map((i) => (i.id === itemId ? updatedItem : i)),
    }));
    setTodasAsListas(newListas);
    Alert.alert("Sucesso", "Item atualizado!", [{ text: "OK", onPress: () => router.back() }]);
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const renderNutriments = () => {
    if (!openFoodFactsDetalhes?.nutriments) return null;
    const { energy_kcal, fat, carbohydrates, proteins } = openFoodFactsDetalhes.nutriments;
    return (
      <>
        <Text style={[styles.label, currentThemeStyles.label]}>Informações Nutricionais (Open Food Facts):</Text>
        <Text style={[styles.valor, currentThemeStyles.valor]}>Calorias: {energy_kcal ? `${energy_kcal} kcal` : "N/A"}</Text>
        <Text style={[styles.valor, currentThemeStyles.valor]}>Gorduras: {fat ? `${fat} g` : "N/A"}</Text>
        <Text style={[styles.valor, currentThemeStyles.valor]}>Carboidratos: {carbohydrates ? `${carbohydrates} g` : "N/A"}</Text>
        <Text style={[styles.valor, currentThemeStyles.valor]}>Proteínas: {proteins ? `${proteins} g` : "N/A"}</Text>
      </>
    );
  };
  
  const nomeOriginalDoProdutoEscaneado = openFoodFactsDetalhes?.product_name_pt ||
                                      openFoodFactsDetalhes?.product_name_en ||
                                      openFoodFactsDetalhes?.product_name;

  if (isLoading) {
    return (
        <SafeAreaView style={[styles.container, currentThemeStyles.container]}>
            <View style={styles.loadingContainer}>
                <Text style={currentThemeStyles.valor}>Carregando...</Text>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, currentThemeStyles.container]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={[styles.titulo, currentThemeStyles.titulo]}>
            {itemEditavel ? "Editar Item da Lista" : "Detalhes do Produto Escaneado"}
          </Text>
        </View>

        {itemEditavel && (
          <View style={[styles.section, currentThemeStyles.section]}>
            <Text style={[styles.label, currentThemeStyles.label]}>Nome do Item:</Text>
            <TextInput
              style={[styles.input, currentThemeStyles.input]}
              value={nomeEditavel}
              onChangeText={setNomeEditavel}
              placeholder="Nome do item"
              placeholderTextColor={currentThemeStyles.input.placeholderTextColor}
            />

            {!isListaTarefasDetalhes && (
              <>
                <Text style={[styles.label, currentThemeStyles.label]}>Quantidade:</Text>
                <Text style={[styles.valor, currentThemeStyles.valor]}>
                  {itemEditavel.quantidade} (Não editável aqui)
                </Text>

                <Text style={[styles.label, currentThemeStyles.label]}>Valor Unitário:</Text>
                <TextInput
                  style={[styles.input, currentThemeStyles.input]}
                  value={valorUnitarioEditavel}
                  onChangeText={setValorUnitarioEditavel}
                  placeholder="0,00"
                  placeholderTextColor={currentThemeStyles.input.placeholderTextColor}
                  keyboardType="decimal-pad"
                />
                <Text style={[styles.totalItemText, currentThemeStyles.totalItemText]}>
                    Total do Item: {formatCurrency(valorTotalCalculado)}
                </Text>
              </>
            )}
          </View>
        )}

        {openFoodFactsDetalhes && (
          <View style={[styles.section, currentThemeStyles.section]}>
            <Text style={[styles.tituloH2, currentThemeStyles.titulo]}>
                {itemEditavel ? "Informações Adicionais (Produto Escaneado)" : "Detalhes do Produto Escaneado"}
            </Text>
            {openFoodFactsDetalhes.image_url && (
              <Image
                source={{ uri: openFoodFactsDetalhes.image_url }}
                style={styles.imagemProduto}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.label, currentThemeStyles.label]}>Nome Original:</Text>
            <Text style={[styles.valor, currentThemeStyles.valor]}>
              {nomeOriginalDoProdutoEscaneado || "Não disponível"}
            </Text>
            <Text style={[styles.label, currentThemeStyles.label]}>Marca:</Text>
            <Text style={[styles.valor, currentThemeStyles.valor]}>
              {openFoodFactsDetalhes.brands || "Não disponível"}
            </Text>
            <Text style={[styles.label, currentThemeStyles.label]}>Quantidade (embalagem):</Text>
            <Text style={[styles.valor, currentThemeStyles.valor]}>
              {openFoodFactsDetalhes.quantity || "Não disponível"}
            </Text>
            {renderNutriments()}
             <Text style={[styles.label, currentThemeStyles.label]}>Categorias:</Text>
            <Text style={[styles.valor, currentThemeStyles.valor]}>
                {openFoodFactsDetalhes.categories || "Não disponível"}
            </Text>
            <Text style={[styles.label, currentThemeStyles.label]}>Ingredientes:</Text>
            <Text style={[styles.valor, currentThemeStyles.valor]}>
                {openFoodFactsDetalhes.ingredients_text || "Não disponível"}
            </Text>
          </View>
        )}
        
        {!itemEditavel && !openFoodFactsDetalhes && ( 
            <View style={[styles.section, currentThemeStyles.section]}>
                <Text style={[styles.valor, currentThemeStyles.valor]}>Nenhum detalhe para exibir.</Text>
            </View>
        )}

        <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, {backgroundColor: currentThemeStyles.botaoVoltar.backgroundColor }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.textoBotao, {color: currentThemeStyles.textoBotaoVoltar.color} ]}>
                Voltar
              </Text>
            </Pressable>
            {itemEditavel && (
              <Pressable
                style={[styles.button, {backgroundColor: currentThemeStyles.botaoSalvar.backgroundColor}]}
                onPress={handleSaveChanges}
              >
                <Text style={[styles.textoBotao, {color: currentThemeStyles.textoBotaoSalvar.color}]}>
                  Salvar Alterações
                </Text>
              </Pressable>
            )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 30, 
  },
  headerContainer: {
    paddingVertical: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  tituloH2: {
    fontSize: 22, 
    fontWeight: "bold",
    marginTop: 15, 
    marginBottom: 10, 
  },
  section: {
    marginBottom: 20, 
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
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4, 
  },
  valor: {
    fontSize: 16,
    marginBottom: 12, 
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 15 : 12, 
    borderRadius: 8,
    marginBottom: 12, 
    marginTop: 4, 
    fontSize: 16,
    borderWidth: 1,
  },
  totalItemText: {
    fontSize: 17, 
    marginTop: 10, 
    marginBottom: 15,
    textAlign: "right",
    fontWeight: "600", 
  },
  imagemProduto: {
    width: "100%",
    height: 220, 
    borderRadius: 12,
    marginBottom: 15, 
  },
  imagemPlaceholder: {
    width: "100%",
    height: 220, 
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15, 
  },
  placeholderTexto: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginTop: 20, 
  },
  button: {
    flex: 1, 
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8, 
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
});
