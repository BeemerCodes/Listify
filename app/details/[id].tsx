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
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_BARCODE_CACHE_KEY = "@userBarcodeCache"; // Mesma chave usada em index.tsx

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
  const currentColorScheme = theme as keyof typeof GlobalCores;

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
      // Apenas define nomeEditavel e valorUnitarioEditavel se eles ainda não foram editados pelo usuário
      // OU se o itemEditavel (o objeto no estado) é diferente do foundItem (novo item carregado)
      // Esta verificação de itemEditavel.id previne o reset se o foundItem for uma nova referência mas mesmos dados.
      if (!itemEditavel || itemEditavel.id !== foundItem.id) {
        setNomeEditavel(foundItem.texto);
        setValorUnitarioEditavel(foundItem.valorUnitario?.toString().replace(".", ",") || "");
      }
      setIsListaTarefasDetalhes(nomeDaListaDoItem.toLowerCase() === "tarefas");
    } else {
      // Se o item não foi encontrado nas listas, não há o que editar.
      // O fluxo normal é que o item já esteja na lista ao abrir esta tela.
      // Se openFoodFactsDetalhes existir, significa que veio do scanner mas não foi adicionado à lista (improvável com fluxo atual).
      // Se não há foundItem, e não há openFoodFactsDetalhes, então é um item desconhecido.
      if (!openFoodFactsDetalhes) { // Apenas mostra alerta se não for um "novo" item via scanner que falhou ao ser adicionado antes.
        Alert.alert("Erro", "Item não encontrado para edição.", [{ text: "OK", onPress: () => router.back() }]);
      }
      // Se openFoodFactsDetalhes existir mas foundItem não, o usuário verá os detalhes do produto escaneado
      // mas os campos de edição (nome/valor) não serão preenchidos a partir de um item de lista.
      // O botão "Salvar Alterações" não aparecerá se itemEditavel for null.
    }
    setIsLoading(false);
  // Removido openFoodFactsDetalhes e router das dependências.
  // As funções de setState (setItemEditavel, etc.) são estáveis e não precisam ser listadas,
  // mas incluí-las não prejudica e pode ser mais explícito para alguns linters.
  }, [itemId, todasAsListas, itemEditavel]); // Adicionado itemEditavel para a lógica de comparação.

  useEffect(() => {
    // Este useEffect recalcula o valor total quando o valor unitário ou a quantidade do itemEditavel mudam.
    // Assegure-se que itemEditavel não seja nulo.
    if (itemEditavel) {
      const quantidade = itemEditavel.quantidade || 0;
      const valorUnit = parseFloat(valorUnitarioEditavel.replace(",", ".")) || 0;
      setValorTotalCalculado(quantidade * valorUnit);
    }
  }, [valorUnitarioEditavel, itemEditavel]); // itemEditavel em vez de itemEditavel.quantidade para reagir a mudança do item

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: GlobalCores[currentColorScheme].background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: GlobalCores[currentColorScheme].background,
    },
    loadingText: {
        color: GlobalCores[currentColorScheme].text,
        fontSize: 16,
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
      backgroundColor: GlobalCores[currentColorScheme].inputBackground,
    },
    placeholderTexto: {
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
  });

  const handleSaveChanges = () => {
    if (!itemEditavel) return;
    const novoValorUnitario = parseFloat(valorUnitarioEditavel.replace(",", ".")) || 0;
    const updatedItem: Item = {
      ...itemEditavel,
      texto: nomeEditavel.trim(),
      valorUnitario: isListaTarefasDetalhes ? itemEditavel.valorUnitario : novoValorUnitario, 
      valorTotalItem: isListaTarefasDetalhes ? itemEditavel.valorTotalItem : ((itemEditavel.quantidade || 0) * novoValorUnitario),
    };
    const newListas = todasAsListas.map((lista) => ({
      ...lista,
      itens: lista.itens.map((i) => (i.id === itemId ? updatedItem : i)),
    }));
    setTodasAsListas(newListas);

    // Salvar no cache se for um item escaneado
    if (updatedItem.detalhes && updatedItem.detalhes.barcode) {
      const barcode = updatedItem.detalhes.barcode;
      try {
        AsyncStorage.getItem(USER_BARCODE_CACHE_KEY).then((cachedDataJson) => {
          const cachedItems = cachedDataJson ? JSON.parse(cachedDataJson) : {};
          cachedItems[barcode] = {
            nome: updatedItem.texto,
            valorUnitario: updatedItem.valorUnitario,
            // Opcional: manter outros detalhes da API se já existirem,
            // ou apenas salvar o que o usuário pode ter modificado.
            // Para manter simples, vamos sobrescrever com os dados atuais do item,
            // incluindo os `detalhes` que podem conter informações da API.
            detalhes: updatedItem.detalhes,
          };
          AsyncStorage.setItem(USER_BARCODE_CACHE_KEY, JSON.stringify(cachedItems));
          console.log(`Item ${barcode} salvo no cache.`);
        });
      } catch (error) {
        console.error("Falha ao salvar item no cache do AsyncStorage", error);
      }
    }

    Alert.alert("Sucesso", "Item atualizado!", [{ text: "OK", onPress: () => router.back() }]);
  };
  
  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const renderNutriments = () => {
    if (!openFoodFactsDetalhes?.nutriments) return null;
    const { energy_kcal, fat, carbohydrates, proteins } = openFoodFactsDetalhes.nutriments;
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
        <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.titulo}>
            {itemEditavel ? "Editar Item da Lista" : "Detalhes do Produto Escaneado"}
          </Text>
        </View>

        {itemEditavel && (
          <View style={styles.section}>
            <Text style={styles.label}>Nome do Item:</Text>
            <TextInput
              style={styles.input}
              value={nomeEditavel}
              onChangeText={setNomeEditavel}
              placeholder="Nome do item"
              placeholderTextColor={GlobalCores[currentColorScheme].placeholderText}
            />
            
            {/* Quantidade foi removida desta tela */}

            {/* Valor Unitário e Total do Item apenas se não for lista de tarefas */}
            {!isListaTarefasDetalhes && (
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
            {itemEditavel && ( 
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