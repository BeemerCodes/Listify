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
  Alert,
} from "react-native";
import { ListContext, Item } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";
import AddItemModal from "../src/components/AddItemModal";
import TotalSummaryModal from "../src/components/TotalSummaryModal";
import { Ionicons } from "@expo/vector-icons";
import { Cores } from "../constants/Colors";

const IconeAdicionar = () => (
  <Text style={{ color: Cores.light.buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

export default function CurrentListScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId, archiveList } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;

  const [loading, setLoading] = useState(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);

  const listaAtiva = todasAsListas.find((l) => l.id === listaAtivaId);
  const isListaTarefas = listaAtiva?.nome.toLowerCase() === "tarefas";

  useEffect(() => {
    console.log("[IndexScreen] useEffect - Verificando listaAtivaId inicial. Todas as listas count:", todasAsListas.length, "Lista Ativa ID:", listaAtivaId);
    if (todasAsListas.length > 0 && !listaAtivaId) {
      console.log("[IndexScreen] Definindo primeira lista como ativa:", todasAsListas[0].id);
      setListaAtivaId(todasAsListas[0].id);
    }
  }, [todasAsListas, listaAtivaId, setListaAtivaId]);

  useEffect(() => {
    if (
      listaAtiva &&
      listaAtiva.itens &&
      listaAtiva.itens.length > 0 &&
      !listaAtiva.isArchived &&
      listaAtiva.itens.every(item => item.comprado)
    ) {
      console.log("[IndexScreen] useEffect - Condições para arquivar lista atendidas para:", listaAtiva.nome);
      Alert.alert(
        "Lista Concluída",
        `Todos os itens da lista "${listaAtiva.nome}" foram marcados. Deseja arquivar esta lista?`,
        [
          { text: "Não", style: "cancel" },
          {
            text: "Sim, Arquivar",
            onPress: () => {
              const nomeListaArquivada = listaAtiva.nome;
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
              Alert.alert("Lista Arquivada", `A lista "${nomeListaArquivada}" foi arquivada.`);
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

  // Estilos permanecem os mesmos...
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
      backgroundColor: currentColorScheme === 'light' ? Cores.light.roxoClaro : Cores.dark.roxoPrincipal,
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
      backgroundColor: Cores[currentColorScheme].tint,
      borderColor: Cores[currentColorScheme].tint,
    },
    checkboxCheck: { color: Cores[currentColorScheme].buttonText, fontWeight: "bold" },
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
      color: Cores[currentColorScheme].tint,
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
    const barcode = params.barcode as string | undefined;
    console.log("[IndexScreen] useEffect - params.barcode recebido:", barcode);
    if (barcode && typeof barcode === "string" && barcode.length > 0) {
      buscarProdutoAPI(barcode);
      router.setParams({ barcode: "" });
    }
  }, [params.barcode]);

  const buscarProdutoAPI = async (barcode: string) => {
    console.log("[buscarProdutoAPI] Iniciando busca para o código:", barcode);
    if (!/^\d{8,13}$/.test(barcode)) {
      Alert.alert(
        "Código Inválido",
        "O código de barras que você escaneou parece inválido. Por favor, verifique se ele contém de 8 a 13 dígitos numéricos e tente novamente."
      );
      return;
    }

    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,product_name_en,product_name_pt,generic_name,brands,quantity,image_url`;
    console.log("[buscarProdutoAPI] URL da API:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "ListfyApp/1.0 - Mobile App",
          Accept: "application/json",
        },
      });
      console.log("[buscarProdutoAPI] Status da Resposta:", response.status, "OK:", response.ok);

      if (!response.ok) {
        if (response.status === 404) {
          console.log("[buscarProdutoAPI] Produto não encontrado (404).");
          throw new Error("ProdutoNaoEncontrado");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log("[buscarProdutoAPI] JSON recebido:", JSON.stringify(json, null, 2));

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
        console.log("[buscarProdutoAPI] Nome do Produto extraído:", nomeDoProduto);
        console.log("[buscarProdutoAPI] Detalhes do Produto para adicionar:", detalhesProduto);
        adicionarItemEscaneado(nomeDoProduto, detalhesProduto);

      } else {
        console.log("[buscarProdutoAPI] Produto não encontrado no JSON (status não é 1 ou não há product).");
        Alert.alert(
          "Produto Não Encontrado",
          "Não encontramos informações para este código de barras em nossa base de dados. Você pode tentar escanear outro produto ou adicioná-lo manualmente à sua lista."
        );
      }
    } catch (error: any) {
      console.error("[buscarProdutoAPI] Erro na busca:", error);
      if (error.message === "ProdutoNaoEncontrado") {
         Alert.alert(
            "Produto Não Encontrado",
            "Não encontramos informações para este código de barras em nossa base de dados. Você pode tentar escanear outro produto ou adicioná-lo manualmente à sua lista."
          );
      } else {
        Alert.alert(
          "Falha na Busca",
          "Não foi possível buscar as informações do produto no momento. Verifique sua conexão com a internet e tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const adicionarItemEscaneado = (texto: string, detalhes?: any) => {
    console.log("[adicionarItemEscaneado] Tentando adicionar:", texto, "Lista Ativa ID:", listaAtivaId);
    if (texto.trim() === "" || !listaAtivaId) {
      Alert.alert("Erro", "Nenhuma lista ativa selecionada para adicionar o item escaneado.");
      return;
    }
    const listaExiste = todasAsListas.find(l => l.id === listaAtivaId);
    if (!listaExiste) {
        Alert.alert("Erro", "Lista ativa não encontrada. Selecione uma lista válida.");
        if (todasAsListas.length > 0) {
            const proximaAtiva = todasAsListas.find(l => !l.isArchived);
            if (proximaAtiva) {
                setListaAtivaId(proximaAtiva.id);
                Alert.alert("Aviso", `Nenhuma lista estava ativa. "${proximaAtiva.nome}" foi selecionada. Tente adicionar o item novamente.`);
            }
        }
        return;
    }
    console.log("[adicionarItemEscaneado] Lista ativa encontrada:", listaExiste.nome);
    const novoItem: Item = {
      id: Date.now().toString(),
      texto: texto,
      quantidade: 1,
      valorUnitario: 0,
      valorTotalItem: 0,
      comprado: false,
      detalhes,
    };
    console.log("[adicionarItemEscaneado] Novo item a ser adicionado:", novoItem);
    const novasListas = todasAsListas.map((lista) =>
      lista.id === listaAtivaId
        ? { ...lista, itens: [novoItem, ...lista.itens] }
        : lista
    );
    setTodasAsListas(novasListas);
    console.log("[adicionarItemEscaneado] Item adicionado. Novas listas:", novasListas);
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
          {!isListaTarefas && ((item.valorUnitario !== undefined && item.valorUnitario > 0) || (item.valorTotalItem !== undefined && item.valorTotalItem > 0)) ? (
            <Text style={[styles.itemValoresTexto, item.comprado && styles.itemTextoComprado]}>
              VU: {formatCurrency(item.valorUnitario || 0)} | Total: {formatCurrency(item.valorTotalItem || 0)}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.acoesItem}>
        {!isListaTarefas && (
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