import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  Pressable,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
  Modal, ScrollView
} from "react-native";
import { ListContext, Item } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";
import AddItemModal from "../src/components/AddItemModal";
import TotalSummaryModal from "../src/components/TotalSummaryModal";
import { Ionicons } from "@expo/vector-icons";
import { Cores } from "../constants/Colors"; // Importar Cores centralizadas

const IconeAdicionar = () => (
  <Text style={{ color: Cores.light.buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

const USER_BARCODE_CACHE_KEY = "@userBarcodeCache";

export default function CurrentListScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId, archiveList } = // Adicionado archiveList
    useContext(ListContext);
  const { theme } = useContext(ThemeContext); // theme é 'light' ou 'dark'
  const currentColorScheme = theme as keyof typeof Cores;

  const [loading, setLoading] = useState(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);
  const [isViewTextModalVisible, setIsViewTextModalVisible] = useState(false);
  const [currentItemText, setCurrentItemText] = useState("");
  const [dismissedArchivePrompts, setDismissedArchivePrompts] = useState<Record<string, boolean>>({});

  const listaAtiva = todasAsListas.find((l) => l.id === listaAtivaId);
  const isListaTarefas = listaAtiva?.nome.toLowerCase() === "tarefas";

  useEffect(() => {
    if (todasAsListas.length > 0 && !listaAtivaId) {
      setListaAtivaId(todasAsListas[0].id);
    }
  }, [todasAsListas, listaAtivaId, setListaAtivaId]);

  // useEffect para verificar se a lista deve ser arquivada
  useEffect(() => {
    if (
      listaAtiva &&
      listaAtiva &&
      listaAtiva.itens &&
      listaAtiva.itens.length > 0 &&
      !listaAtiva.isArchived &&
      listaAtiva.itens.every(item => item.comprado) &&
      !dismissedArchivePrompts[listaAtiva.id] // Adicionada esta condição
    ) {
      Alert.alert(
        "Lista Concluída",
        `Todos os itens da lista "${listaAtiva.nome}" foram marcados. Deseja arquivar esta lista?`,
        [
          {
            text: "Não",
            style: "cancel",
            onPress: () => {
              setDismissedArchivePrompts(prev => ({ ...prev, [listaAtiva.id]: true }));
            },
          },
          {
            text: "Sim, Arquivar",
            onPress: () => {
              archiveList(listaAtiva.id);
              setDismissedArchivePrompts(prev => {
                const newState = { ...prev };
                delete newState[listaAtiva.id]; // Limpa o prompt para esta lista, caso seja desarquivada
                return newState;
              });
              // Lógica para encontrar a próxima lista ativa...
              const proximaListaAtiva = todasAsListas.find(l => l.id !== listaAtiva.id && !l.isArchived);
              if (proximaListaAtiva) {
                setListaAtivaId(proximaListaAtiva.id);
              } else {
                const algumaListaNaoArquivada = todasAsListas.find(l => !l.isArchived && l.id !== listaAtiva.id);
                if(algumaListaNaoArquivada){
                    setListaAtivaId(algumaListaNaoArquivada.id);
                } else {
                    router.push("/lists");
                }
              }
              Alert.alert("Lista Arquivada", `A lista "${listaAtiva.nome}" foi arquivada.`);
            },
          },
        ],
        { cancelable: true }
      );
    }
  }, [listaAtiva, todasAsListas, archiveList, setListaAtivaId, router, dismissedArchivePrompts]);

  // Limpar o dismissed prompt se a lista ativa mudar e não estiver mais completa, ou se for arquivada/desarquivada externamente
  useEffect(() => {
    if (listaAtiva && dismissedArchivePrompts[listaAtiva.id]) {
      const isStillComplete = listaAtiva.itens && listaAtiva.itens.length > 0 && listaAtiva.itens.every(item => item.comprado);
      if (!isStillComplete || listaAtiva.isArchived) {
        setDismissedArchivePrompts(prev => {
          const newState = { ...prev };
          delete newState[listaAtiva.id];
          return newState;
        });
      }
    }
  }, [listaAtiva, dismissedArchivePrompts]);


  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: Cores[currentColorScheme].background,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerContainer: { paddingVertical: 20, paddingHorizontal: 20 },
    titulo: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "left",
      color: Cores[currentColorScheme].text,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    fabSummary: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 80,
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: currentColorScheme === 'light' ? Cores.light.roxoClaro : Cores.dark.roxoPrincipal, // Exemplo de lógica de cor específica
      elevation: 7,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
    },
    itemListaContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 12,
      marginHorizontal: 20,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      backgroundColor: Cores[currentColorScheme].cardBackground,
      borderColor: Cores[currentColorScheme].borderColor,
    },
    checkboxArea: { flexDirection: "row", alignItems: "center", flex: 1 },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      borderColor: Cores[currentColorScheme].borderColor,
    },
    checkboxComprado: {
      backgroundColor: Cores[currentColorScheme].tint, // Usar tint para checkbox marcado
      borderColor: Cores[currentColorScheme].tint,
    },
    checkboxCheck: { color: Cores[currentColorScheme].buttonText, fontWeight: "bold" }, // Texto do check usa a cor do texto do botão primário
    itemListaTexto: {
      fontSize: 18,
      flexShrink: 1,
      color: Cores[currentColorScheme].text,
    },
    itemTextoComprado: {
      textDecorationLine: "line-through",
      color: Cores[currentColorScheme].textSecondary,
    },
    itemValoresTexto: {
      fontSize: 13,
      color: Cores[currentColorScheme].textSecondary,
      opacity: 0.8,
      marginTop: 2,
    },
    acoesItem: { flexDirection: "row", alignItems: "center" },
    botaoAcao: { padding: 8 },
    textoBotaoAcao: {
      fontSize: 20,
      fontWeight: "bold",
      color: Cores[currentColorScheme].tint, // Ações como + e - usam a cor de tint
    },
    quantidade: {
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 5,
      color: Cores[currentColorScheme].text,
    },
    listaVaziaTexto: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 50,
      color: Cores[currentColorScheme].textSecondary,
    },
    // Estilos para o Modal de Visualização de Texto
    modalViewTextContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalViewTextContent: {
      width: "90%",
      maxWidth: 500,
      maxHeight: "70%",
      backgroundColor: Cores[currentColorScheme].cardBackground,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalViewTextTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
      color: Cores[currentColorScheme].text,
    },
    modalViewTextScrollView: {
      marginBottom: 20,
    },
    modalViewFullText: {
      fontSize: 17,
      color: Cores[currentColorScheme].text,
      lineHeight: 24,
    },
    modalViewTextCloseButton: {
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    modalViewTextCloseButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
  });

  useEffect(() => {
    const barcode = params.barcode;
    if (barcode && typeof barcode === "string" && barcode.length > 0) {
      handleBarcodeScanned(barcode); // Nome mais genérico para a função que agora pode ou não chamar a API
      router.setParams({ barcode: "" }); // Limpa o parâmetro para evitar re-scan automático
    }
  }, [params.barcode]);

  const handleBarcodeScanned = async (barcode: string) => {
    if (!/^\d{8,13}$/.test(barcode)) {
      Alert.alert(
        "Código Inválido",
        "O código de barras que você escaneou parece inválido. Por favor, verifique se ele contém de 8 a 13 dígitos numéricos e tente novamente."
      );
      return;
    }

    setLoading(true);

    try {
      const cachedDataJson = await AsyncStorage.getItem(USER_BARCODE_CACHE_KEY);
      const cachedItems = cachedDataJson ? JSON.parse(cachedDataJson) : {};
      const cachedProduct = cachedItems[barcode];

      if (cachedProduct) {
        console.log("Produto encontrado no cache:", cachedProduct);
        // Usar dados do cache. `detalhes` pode ser uma combinação ou apenas o que foi salvo.
        // Por enquanto, vamos assumir que o cache contém o nome e valorUnitario.
        // Os `detalhes` ainda podem vir da API ou ser parcialmente preenchidos.
        const detalhesProduto = {
          ...(cachedProduct.detalhes || {}), // Mantém detalhes da API se existirem no cache
          barcode: barcode, // Garante que o barcode esteja nos detalhes
          product_name: cachedProduct.nome, // Prioriza nome do cache
          // Outros campos como brands, quantity, image_url podem vir de `cachedProduct.detalhes`
          // ou serem buscados novamente se desejado (fora do escopo desta alteração simples)
        };
        adicionarItemComDados(cachedProduct.nome, cachedProduct.valorUnitario, detalhesProduto);
        setLoading(false);
        return; // Item adicionado a partir do cache, não precisa buscar na API
      }

      // Se não estiver no cache, buscar na API
      const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,product_name_en,product_name_pt,generic_name,brands,quantity,image_url`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "ListfyApp/1.0 - Mobile App",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("ProdutoNaoEncontrado");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      if (json.status === 1 && json.product) {
        const nomeDoProduto =
          json.product.product_name_pt ||
          json.product.product_name_en ||
          json.product.product_name ||
          (json.product.brands && json.product.generic_name
            ? `${json.product.brands} ${json.product.generic_name}`
            : json.product.brands || json.product.generic_name) ||
          `Produto ${barcode}`;

        const detalhesProduto = {
          product_name: nomeDoProduto,
          brands: json.product.brands,
          quantity: json.product.quantity,
          image_url: json.product.image_url,
          barcode: barcode,
        };
        // Adiciona com valor unitário padrão 0, já que não temos cache
        adicionarItemComDados(nomeDoProduto, 0, detalhesProduto);
      } else {
        Alert.alert(
          "Produto Não Encontrado",
          "Não encontramos informações para este código de barras. Você pode adicioná-lo manualmente."
        );
      }
    } catch (error: any) {
      if (error.message === "ProdutoNaoEncontrado") {
        Alert.alert(
          "Produto Não Encontrado",
          "Não encontramos informações para este código de barras. Você pode adicioná-lo manualmente."
        );
      } else {
        console.error("Falha ao buscar produto (API ou Cache):", error);
        Alert.alert(
          "Falha na Busca",
          "Não foi possível buscar as informações do produto. Verifique sua conexão ou tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Função unificada para adicionar item, seja do cache ou da API
  const adicionarItemComDados = (texto: string, valorUnitario: number = 0, detalhes?: any) => {
    if (texto.trim() === "" || !listaAtivaId) {
      Alert.alert("Erro", "Nenhuma lista ativa selecionada para adicionar o item.");
      return;
    }
    
    let listaParaAtualizar = todasAsListas.find(l => l.id === listaAtivaId);

    if (!listaParaAtualizar) {
        Alert.alert("Erro", "Lista ativa não encontrada. Selecione uma lista válida.");
        // Lógica para tentar encontrar uma lista ativa alternativa omitida para brevidade, mas deve ser mantida ou ajustada.
        return;
    }

    const barcodeDoNovoItem = detalhes?.barcode;
    let itemExistente = null;

    // Prioridade 1: Verificar por barcode
    if (barcodeDoNovoItem) {
      itemExistente = listaParaAtualizar.itens.find(
        (i) => i.detalhes?.barcode === barcodeDoNovoItem
      );
    }

    // Prioridade 2: Verificar por nome (se não encontrado por barcode)
    if (!itemExistente) {
      itemExistente = listaParaAtualizar.itens.find(
        (i) => i.texto.toLowerCase() === texto.toLowerCase()
      );
    }

    if (itemExistente && !isListaTarefas) { // Só agrupa se não for lista de tarefas
      // Item encontrado, apenas incrementa a quantidade
      const novasLojas = todasAsListas.map((lista) => {
        if (lista.id === listaAtivaId) {
          return {
            ...lista,
            itens: lista.itens.map((i) => {
              if (i.id === itemExistente!.id) {
                const novaQuantidade = i.quantidade + 1;
                return {
                  ...i,
                  quantidade: novaQuantidade,
                  valorTotalItem: (i.valorUnitario || 0) * novaQuantidade,
                  // Opcional: atualizar 'detalhes' se o novo item escaneado tiver infos mais recentes
                  // detalhes: detalhes || i.detalhes, 
                };
              }
              return i;
            }),
          };
        }
        return lista;
      });
      setTodasAsListas(novasLojas);
      // Alert.alert("Item Atualizado", `A quantidade de "${texto}" foi incrementada.`); // Removido
    } else {
      // Adiciona como novo item
      const novoItem: Item = {
        id: Date.now().toString(),
        texto: texto,
        quantidade: 1,
        valorUnitario: valorUnitario,
        valorTotalItem: valorUnitario, // para quantidade 1
        comprado: false,
        detalhes,
      };
      const novasLojas = todasAsListas.map((lista) =>
        lista.id === listaAtivaId
          ? { ...lista, itens: [novoItem, ...lista.itens] }
          : lista
      );
      setTodasAsListas(novasLojas);
    }
    Keyboard.dismiss();
  };


  const handleMudarQuantidade = (itemId: string, delta: number) => {
    const novasListas = todasAsListas.map((l) =>
      l.id === listaAtivaId
        ? {
            ...l,
            itens: l.itens.map((i) =>
              i.id === itemId
                ? { ...i, quantidade: Math.max(1, i.quantidade + delta) }
                : i
            ),
          }
        : l
    );
    setTodasAsListas(novasListas);
  };

  const handleMarcarItem = (itemId: string) => {
    let itemFoiDesmarcado = false;
    let listaIdDoItem = "";

    const novasListas = todasAsListas.map((l) => {
      if (l.id === listaAtivaId) {
        listaIdDoItem = l.id;
        return {
          ...l,
          itens: l.itens.map((i) => {
            if (i.id === itemId) {
              if (i.comprado) { // Se estava comprado, vai ser desmarcado
                itemFoiDesmarcado = true;
              }
              return { ...i, comprado: !i.comprado };
            }
            return i;
          }),
        };
      }
      return l;
    });

    setTodasAsListas(novasListas);

    // Se um item foi desmarcado na lista ativa, e essa lista tinha um prompt dispensado, limpa o prompt
    if (itemFoiDesmarcado && listaIdDoItem && dismissedArchivePrompts[listaIdDoItem]) {
      setDismissedArchivePrompts(prev => {
        const newState = { ...prev };
        delete newState[listaIdDoItem];
        return newState;
      });
    }
  };

  const handleRemoverItem = (itemId: string) => {
    const novasListas = todasAsListas.map((l) =>
      l.id === listaAtivaId
        ? { ...l, itens: l.itens.filter((i) => i.id !== itemId) }
        : l
    );
    setTodasAsListas(novasListas);
  };

  const handleNavigateToDetails = (item: Item) => { // Renomeado para clareza
    const paramsNavegacao: any = { id: item.id };
    if (item.detalhes) {
      paramsNavegacao.itemDetalhesJSON = JSON.stringify(item.detalhes);
    }
    router.push({
      pathname: "/details/[id]",
      params: paramsNavegacao,
    });
  };

  const handleShowFullText = (text: string) => {
    setCurrentItemText(text);
    setIsViewTextModalVisible(true);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable
      onPress={() => handleShowFullText(item.texto)} // Toque curto para ver texto completo
      onLongPress={() => handleNavigateToDetails(item)} // Toque longo para editar
      delayLongPress={300} // Tempo para considerar long press
      style={styles.itemListaContainer}
    >
      <View style={styles.checkboxArea}>
        <Pressable
          onPress={() => handleMarcarItem(item.id)}
          style={[styles.checkbox, item.comprado && styles.checkboxComprado]}
        >
          {item.comprado && <Text style={styles.checkboxCheck}>✓</Text>}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.itemListaTexto,
              item.comprado && styles.itemTextoComprado,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.texto}
          </Text>
          {/* Exibir valores apenas se não for lista de tarefas E se houver valores > 0 */}
          {!isListaTarefas && ((item.valorUnitario !== undefined && item.valorUnitario > 0) || (item.valorTotalItem !== undefined && item.valorTotalItem > 0)) ? (
            <Text style={[styles.itemValoresTexto, item.comprado && styles.itemTextoComprado]}>
              VU: {formatCurrency(item.valorUnitario || 0)} | Total: {formatCurrency(item.valorTotalItem || 0)}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.acoesItem}>
        {!isListaTarefas && ( // Renderiza controles de quantidade apenas se não for lista de tarefas
          <>
            <Pressable
              onPress={() => handleMudarQuantidade(item.id, -1)}
              style={styles.botaoAcao}
            >
              <Text style={styles.textoBotaoAcao}>-</Text>
            </Pressable>
            <Text style={styles.quantidade}>{item.quantidade}</Text>
            <Pressable
              onPress={() => handleMudarQuantidade(item.id, 1)}
              style={styles.botaoAcao}
            >
              <Text style={styles.textoBotaoAcao}>+</Text>
            </Pressable>
          </>
        )}
        <Pressable
          onPress={() => handleRemoverItem(item.id)}
          style={[styles.botaoAcao, { marginLeft: 8 }]}
        >
          <IconeLixeira currentTheme={currentColorScheme} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={Cores[currentColorScheme].background}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={Cores[currentColorScheme].tint}
          />
        </View>
      )}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>
          {listaAtiva ? (listaAtiva.isArchived ? `${listaAtiva.nome} (Arquivada)` : listaAtiva.nome) : "Carregando Lista..."}
        </Text>
      </View>
      {/* Adicionar verificação para listaAtiva e se está arquivada antes de renderizar a FlatList e FABs */}
      {listaAtiva && !listaAtiva.isArchived ? (
        <>
          <FlatList
            data={listaAtiva.itens || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() =>
              !loading && (
                <Text style={styles.listaVaziaTexto}>
                  A sua lista está vazia.
                </Text>
              )
            }
            contentContainerStyle={listaAtiva.itens?.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
          />
          {/* Mostrar FAB de resumo apenas se não for lista de tarefas e tiver itens */}
          {listaAtiva.itens && listaAtiva.itens.length > 0 && !isListaTarefas && (
            <Pressable style={styles.fabSummary} onPress={() => setIsSummaryModalVisible(true)}>
              <Ionicons name="cash-outline" size={26} color={Cores.light.buttonText} />
            </Pressable>
          )}
          <Pressable style={styles.fab} onPress={() => setIsAddItemModalVisible(true)}>
            <Ionicons name="add" size={30} color={Cores.light.buttonText} />
          </Pressable>
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
          <Text style={styles.listaVaziaTexto}>
            {listaAtiva?.isArchived
              ? `A lista "${listaAtiva.nome}" está arquivada. Selecione ou crie uma nova lista em "Minhas Listas".`
              : (listaAtivaId ? "Carregando lista..." : "Nenhuma lista selecionada. Visite 'Minhas Listas' para selecionar ou criar uma.")
            }
          </Text>
          {/* Opcional: Botão para navegar para a tela de listas se nenhuma lista ativa não arquivada for encontrada */}
          {!listaAtiva && !loading && (
             <Pressable style={[styles.fab, {position: 'relative', marginVertical: 20}]} onPress={() => router.push('/lists')}>
                <Text style={{color: Cores.light.buttonText, fontSize: 16, fontWeight: 'bold'}}>Ver Listas</Text>
            </Pressable>
          )}
        </View>
      )}

      {listaAtivaId && listaAtiva && !listaAtiva.isArchived && (
        <AddItemModal
          visible={isAddItemModalVisible}
          onClose={() => setIsAddItemModalVisible(false)}
          listaId={listaAtivaId}
        />
      )}
      {listaAtivaId && listaAtiva && (
        <TotalSummaryModal
          visible={isSummaryModalVisible}
          onClose={() => setIsSummaryModalVisible(false)}
          items={listaAtiva.itens}
          listName={listaAtiva.nome}
        />
      )}

      {/* Modal para Visualizar Texto Completo do Item */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isViewTextModalVisible}
        onRequestClose={() => setIsViewTextModalVisible(false)}
      >
        <View style={styles.modalViewTextContainer}>
          <View style={styles.modalViewTextContent}>
            <Text style={styles.modalViewTextTitle}>Nome Completo do Item</Text>
            <ScrollView style={styles.modalViewTextScrollView}>
              <Text style={styles.modalViewFullText}>{currentItemText}</Text>
            </ScrollView>
            <Pressable
              style={styles.modalViewTextCloseButton}
              onPress={() => setIsViewTextModalVisible(false)}
            >
              <Text style={styles.modalViewTextCloseButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
