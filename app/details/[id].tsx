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
  Alert, // Manter Alert para confirmações ou erros críticos que não devem ser toasts
  KeyboardAvoidingView,
} from "react-native";
import { ThemeContext } from "../../src/context/ThemeContext";
import { ListContext, Item } from "../../src/context/ListContext";
import { Cores as GlobalCores } from "../../constants/Colors";
import { StatusBar } from "expo-status-bar";
// import { showSuccessToast, showErrorToast } from "../../src/utils/toastService"; // Remover toasts

// Interface para os estilos do tema (será definida abaixo)
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
  const [isListaTarefasDetalhes, setIsListaTarefasDetalhes] = useState(false); // Este estado determinará se é uma lista de tarefas
  const currentColorScheme = theme as keyof typeof GlobalCores; // Definir currentColorScheme aqui


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
      Alert.alert("Erro", "Item não encontrado em suas listas.", [{ text: "OK", onPress: () => router.back() }]); // Revertido
      // router.back(); // Chamado dentro do Alert agora
    }
    setIsLoading(false);
  }, [itemId, todasAsListas, router, openFoodFactsDetalhes]);

  useEffect(() => {
    const quantidade = itemEditavel?.quantidade || 0;
    // Converte valorUnitarioEditavel para número, tratando vírgula
    const valorUnit = parseFloat(valorUnitarioEditavel.replace(",", ".")) || 0;
    setValorTotalCalculado(quantidade * valorUnit);
  }, [valorUnitarioEditavel, itemEditavel?.quantidade]);

  // const isDarkTheme = theme === "dark"; // Não é mais necessário com currentColorScheme
  // themeStyles e currentThemeStyles não são mais necessários aqui, usaremos GlobalCores diretamente nos estilos do StyleSheet

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalCores[currentColorScheme].background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: GlobalCores[currentColorScheme].background, // Para cobrir a tela durante o loading
    },
    loadingText: { // Estilo para o texto de carregamento
        color: GlobalCores[currentColorScheme].text,
        fontSize: 16,
    },
    scrollContent: {
      paddingBottom: Platform.OS === 'ios' ? 40 : 30,
      paddingHorizontal: 20,
    },
    headerContainer: {
      paddingVertical: 20,
    },
    titulo: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "left",
      color: GlobalCores[currentColorScheme].text,
    },
    tituloH2: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 10,
      color: GlobalCores[currentColorScheme].text,
    },
    section: {
      marginBottom: 20,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: GlobalCores[currentColorScheme].cardBackground,
      borderColor: GlobalCores[currentColorScheme].borderColor,
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
      color: GlobalCores[currentColorScheme].text,
    },
    valor: {
      fontSize: 16,
      marginBottom: 12,
      color: GlobalCores[currentColorScheme].textSecondary,
    },
    input: {
      paddingHorizontal: 15,
      paddingVertical: Platform.OS === "ios" ? 15 : 12,
      borderRadius: 8,
      marginBottom: 12,
      marginTop: 4,
      fontSize: 16,
      borderWidth: 1,
      backgroundColor: GlobalCores[currentColorScheme].inputBackground,
      color: GlobalCores[currentColorScheme].text,
      borderColor: GlobalCores[currentColorScheme].inputBorder,
    },
    totalItemText: {
      fontSize: 17,
      marginTop: 10,
      marginBottom: 15,
      textAlign: "right",
      fontWeight: "600",
      color: GlobalCores[currentColorScheme].text,
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
      backgroundColor: GlobalCores[currentColorScheme].inputBackground, // Usar uma cor de fundo do tema
    },
    placeholderTexto: { // Para o texto dentro do placeholder da imagem
      fontSize: 16,
      color: GlobalCores[currentColorScheme].textSecondary,
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
    // Os estilos específicos de botão (salvar, voltar) serão aplicados inline usando GlobalCores
  });


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
    Alert.alert("Sucesso", "As alterações no item foram salvas.", [{ text: "OK", onPress: () => router.back() }]); // Revertido
    // router.back(); // Chamado dentro do Alert agora
  };

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const renderNutriments = () => {
    if (!openFoodFactsDetalhes?.nutriments) return null;
    const { energy_kcal, fat, carbohydrates, proteins } = openFoodFactsDetalhes.nutriments;
    // Usar styles.label e styles.valor diretamente, pois já são dinâmicos
    return (
      <>
        <Text style={styles.label}>Informações Nutricionais (Open Food Facts):</Text>
        <Text style={styles.valor}>Calorias: {energy_kcal ? `${energy_kcal} kcal` : "N/A"}</Text>
        <Text style={styles.valor}>Gorduras: {fat ? `${fat} g` : "N/A"}</Text>
        <Text style={styles.valor}>Carboidratos: {carbohydrates ? `${carbohydrates} g` : "N/A"}</Text>
        <Text style={styles.valor}>Proteínas: {proteins ? `${proteins} g` : "N/A"}</Text>
      </>
    );
  };

  const nomeOriginalDoProdutoEscaneado = openFoodFactsDetalhes?.product_name_pt ||
                                      openFoodFactsDetalhes?.product_name_en ||
                                      openFoodFactsDetalhes?.product_name;

  if (isLoading) {
    return (
        // Usar styles.container e styles.loadingText (ou styles.valor para consistência)
        <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        </SafeAreaView>
    );
  }

  return (
    // Usar styles.container diretamente
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          {/* Usar styles.titulo diretamente */}
          <Text style={styles.titulo}>
            {itemEditavel ? "Editar Item da Lista" : "Detalhes do Produto Escaneado"}
          </Text>
        </View>

        {itemEditavel && (
          // Usar styles.section diretamente
          <View style={styles.section}>
            {/* Usar styles.label e styles.input diretamente */}
            <Text style={styles.label}>Nome do Item:</Text>
            <TextInput
              style={styles.input}
              value={nomeEditavel}
              onChangeText={setNomeEditavel}
              placeholder="Nome do item"
              placeholderTextColor={GlobalCores[currentColorScheme].placeholderText}
            />

            {/* Quantidade removida desta tela */}

            {/* Valor Unitário e Total do Item apenas se não for lista de tarefas E se itemEditavel existir */}
            {itemEditavel && !isListaTarefasDetalhes && (
              <>
                <Text style={styles.label}>Valor Unitário:</Text>
                <TextInput
                  style={styles.input}
                  value={valorUnitarioEditavel}
                  onChangeText={setValorUnitarioEditavel}
                  placeholder="0,00"
                  placeholderTextColor={GlobalCores[currentColorScheme].placeholderText}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.totalItemText}>
                    Total do Item: {formatCurrency(valorTotalCalculado)}
                </Text>
              </>
            )}
          </View>
        )}

        {openFoodFactsDetalhes && (
          <View style={styles.section}>
            <Text style={styles.tituloH2}>
                {itemEditavel ? "Informações Adicionais (Produto Escaneado)" : "Detalhes do Produto Escaneado"}
            </Text>
            {openFoodFactsDetalhes.image_url && (
              <Image
                source={{ uri: openFoodFactsDetalhes.image_url }}
                style={styles.imagemProduto}
                resizeMode="contain"
              />
            )}
            <Text style={styles.label}>Nome Original:</Text>
            <Text style={styles.valor}>
              {nomeOriginalDoProdutoEscaneado || "Não disponível"}
            </Text>
            <Text style={styles.label}>Marca:</Text>
            <Text style={styles.valor}>
              {openFoodFactsDetalhes.brands || "Não disponível"}
            </Text>
            <Text style={styles.label}>Quantidade (embalagem):</Text>
            <Text style={styles.valor}>
              {openFoodFactsDetalhes.quantity || "Não disponível"}
            </Text>
            {renderNutriments()}
             <Text style={styles.label}>Categorias:</Text>
            <Text style={styles.valor}>
                {openFoodFactsDetalhes.categories || "Não disponível"}
            </Text>
            <Text style={styles.label}>Ingredientes:</Text>
            <Text style={styles.valor}>
                {openFoodFactsDetalhes.ingredients_text || "Não disponível"}
            </Text>
          </View>
        )}

        {!itemEditavel && !openFoodFactsDetalhes && (
            <View style={styles.section}>
                <Text style={styles.valor}>Nenhum detalhe para exibir.</Text>
            </View>
        )}

        <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, {backgroundColor: GlobalCores[currentColorScheme].buttonSecondaryBackground }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.textoBotao, {color: GlobalCores[currentColorScheme].buttonSecondaryText} ]}>
                Voltar
              </Text>
            </Pressable>
            {itemEditavel && ( // Botão de salvar só aparece se estivermos editando um item da lista
              <Pressable
                style={[styles.button, {backgroundColor: GlobalCores[currentColorScheme].buttonPrimaryBackground}]}
                onPress={handleSaveChanges}
              >
                <Text style={[styles.textoBotao, {color: GlobalCores[currentColorScheme].buttonText}]}>
                  Salvar Alterações
                </Text>
              </Pressable>
            )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

// StyleSheet.create foi movido para cima, após a definição de currentColorScheme
// para que possa ser usado na definição dos estilos.