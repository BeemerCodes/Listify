import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
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
  Alert, // Alert ainda será usado para confirmações
} from "react-native";
import { ListContext, Item } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";
import AddItemModal from "../src/components/AddItemModal";
import TotalSummaryModal from "../src/components/TotalSummaryModal";
import { Ionicons } from "@expo/vector-icons";
import { Cores } from "../constants/Colors";
import { showErrorToast, showInfoToast } from "../src/utils/toastService"; // Importar o serviço de toast

const IconeAdicionar = () => (
  <Text style={{ color: Cores.light.buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

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
      listaAtiva.itens &&
      listaAtiva.itens.length > 0 &&
      !listaAtiva.isArchived &&
      listaAtiva.itens.every(item => item.comprado)
    ) {
      Alert.alert( // Alert de confirmação permanece Alert.alert
        "Lista Concluída",
        `Todos os itens da lista "${listaAtiva.nome}" foram marcados. Deseja arquivar esta lista?`,
        [
          { text: "Não", style: "cancel" },
          {
            text: "Sim, Arquivar",
            onPress: () => {
              const nomeListaArquivada = listaAtiva.nome; // Salva o nome antes que listaAtiva mude
              archiveList(listaAtiva.id);
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
              // Usar showInfoToast para feedback não bloqueante
              showInfoToast(`A lista "${nomeListaArquivada}" foi arquivada.`, "Lista Arquivada");
            },
          },
        ],
        { cancelable: true }
      );
    }
  }, [listaAtiva, todasAsListas, archiveList, setListaAtivaId, router]);


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
  });

  useEffect(() => {
    const barcode = params.barcode;
    if (barcode && typeof barcode === "string" && barcode.length > 0) {
      buscarProdutoAPI(barcode); // Renomeado para buscarProdutoAPI para clareza
      router.setParams({ barcode: "" }); // Limpa o parâmetro para evitar re-scan automático
    }
  }, [params.barcode]);

  const buscarProdutoAPI = async (barcode: string) => {
    if (!/^\d{8,13}$/.test(barcode)) {
      showErrorToast(
        "O código de barras que você escaneou parece inválido. Por favor, verifique se ele contém de 8 a 13 dígitos numéricos e tente novamente.",
        "Código Inválido"
      );
      return;
    }

    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,product_name_en,product_name_pt,generic_name,brands,quantity,image_url`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "ListfyApp/1.0 - Mobile App", // Boa prática incluir User-Agent
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        // Tratar status não-OK de forma mais genérica antes de tentar parsear JSON
        if (response.status === 404) {
          throw new Error("ProdutoNaoEncontrado"); // Erro customizado para tratar especificamente
        }
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
          `Produto ${barcode}`; // Fallback mais informativo

        // Passar apenas os detalhes relevantes para adicionarItemEscaneado
        const detalhesProduto = {
            product_name: nomeDoProduto, // Usar o nome já processado
            brands: json.product.brands,
            quantity: json.product.quantity,
            image_url: json.product.image_url,
            barcode: barcode, // Adicionar o barcode aos detalhes
        };
        adicionarItemEscaneado(nomeDoProduto, detalhesProduto);

      } else {
        showErrorToast(
          "Não encontramos informações para este código de barras em nossa base de dados. Você pode tentar escanear outro produto ou adicioná-lo manualmente à sua lista.",
          "Produto Não Encontrado"
        );
      }
    } catch (error: any) {
      if (error.message === "ProdutoNaoEncontrado") {
        showErrorToast(
          "Não encontramos informações para este código de barras em nossa base de dados. Você pode tentar escanear outro produto ou adicioná-lo manualmente à sua lista.",
          "Produto Não Encontrado"
        );
      } else {
        showErrorToast(
          "Não foi possível buscar as informações do produto no momento. Verifique sua conexão com a internet e tente novamente.",
          "Falha na Busca"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const adicionarItemEscaneado = (texto: string, detalhes?: any) => {
    if (texto.trim() === "" || !listaAtivaId) {
      showErrorToast("Nenhuma lista ativa selecionada para adicionar o item escaneado.", "Erro");
      return;
    }
    const listaExiste = todasAsListas.find(l => l.id === listaAtivaId);
    if (!listaExiste) {
        showErrorToast("Lista ativa não encontrada. Selecione uma lista válida.", "Erro");
        if (todasAsListas.length > 0) {
            const proximaAtiva = todasAsListas.find(l => !l.isArchived);
            if (proximaAtiva) {
                setListaAtivaId(proximaAtiva.id);
                showInfoToast(`Nenhuma lista estava ativa. "${proximaAtiva.nome}" foi selecionada. Tente adicionar o item novamente.`, "Aviso");
            }
        }
        return;
    }
    const novoItem: Item = {
      id: Date.now().toString(),
      texto: texto,
      quantidade: 1,
      valorUnitario: 0,
      valorTotalItem: 0,
      comprado: false,
      detalhes,
    };
    const novasListas = todasAsListas.map((lista) =>
      lista.id === listaAtivaId
        ? { ...lista, itens: [novoItem, ...lista.itens] }
        : lista
    );
    setTodasAsListas(novasListas);
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
    const novasListas = todasAsListas.map((l) =>
      l.id === listaAtivaId
        ? {
            ...l,
            itens: l.itens.map((i) =>
              i.id === itemId ? { ...i, comprado: !i.comprado } : i
            ),
          }
        : l
    );
    setTodasAsListas(novasListas);
  };

  const handleRemoverItem = (itemId: string) => {
    const novasListas = todasAsListas.map((l) =>
      l.id === listaAtivaId
        ? { ...l, itens: l.itens.filter((i) => i.id !== itemId) }
        : l
    );
    setTodasAsListas(novasListas);
  };

  const handleVerDetalhes = (item: Item) => {
    const paramsNavegacao: any = { id: item.id };
    if (item.detalhes) {
      paramsNavegacao.itemDetalhesJSON = JSON.stringify(item.detalhes);
    }
    router.push({
      pathname: "/details/[id]",
      params: paramsNavegacao,
    });
  };

  const renderItem = ({ item }: { item: Item }) => (
    <Pressable
      onPress={() => handleVerDetalhes(item)}
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
          {listaAtiva.itens && listaAtiva.itens.length > 0 && (
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
    </SafeAreaView>
  );
}
