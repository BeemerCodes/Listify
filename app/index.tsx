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
import { Cores } from "../constants/Colors"; // Importar Cores centralizadas

const IconeAdicionar = () => (
  <Text style={{ color: Cores.light.buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

export default function CurrentListScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext); // theme é 'light' ou 'dark'
  const currentColorScheme = theme as keyof typeof Cores;

  const [loading, setLoading] = useState(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isSummaryModalVisible, setIsSummaryModalVisible] = useState(false);

  const listaAtiva = todasAsListas.find((l) => l.id === listaAtivaId);

  useEffect(() => {
    if (todasAsListas.length > 0 && !listaAtivaId) {
      setListaAtivaId(todasAsListas[0].id);
    }
  }, [todasAsListas, listaAtivaId, setListaAtivaId]);

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
      // @ts-ignore
      buscarProduto(barcode); // buscarProduto não está definido neste escopo, precisaria ser movido ou ajustado
      router.setParams({ barcode: "" });
    }
  }, [params.barcode]);

  // Definição de buscarProduto (simplificada, pois não está no escopo original do problema de cores)
  const buscarProduto = async (barcode: string) => {
    if (!/^\d{8,13}$/.test(barcode)) {
      Alert.alert("Erro","Código de barras inválido. Deve conter 8 a 13 dígitos numéricos.");
      return;
    }
    setLoading(true);
    // Simular busca e adicionar item
    // Em uma implementação real, aqui iria a lógica de fetch
    setTimeout(() => {
      const nomeDoProduto = `Produto ${barcode}`;
      adicionarItemEscaneado(nomeDoProduto, { scanned: true });
      setLoading(false);
    }, 1000);
  };


  const adicionarItemEscaneado = (texto: string, detalhes?: any) => {
    if (texto.trim() === "" || !listaAtivaId) {
      Alert.alert("Erro", "Nenhuma lista ativa selecionada para adicionar o item escaneado.");
      return;
    }
    if (!todasAsListas.find(l => l.id === listaAtivaId)) {
        Alert.alert("Erro", "Lista ativa não encontrada. Selecione uma lista válida.");
        if (todasAsListas.length > 0) {
            setListaAtivaId(todasAsListas[0].id);
            Alert.alert("Aviso", "Nenhuma lista estava ativa. A primeira lista foi selecionada. Tente adicionar o item novamente.");
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
          {(item.valorUnitario !== undefined && item.valorUnitario > 0) || (item.valorTotalItem !== undefined && item.valorTotalItem > 0) ? (
            <Text style={[styles.itemValoresTexto, item.comprado && styles.itemTextoComprado]}>
              VU: {formatCurrency(item.valorUnitario || 0)} | Total: {formatCurrency(item.valorTotalItem || 0)}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.acoesItem}>
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
        <Text style={styles.titulo}>{listaAtiva?.nome || "Carregando Lista..."}</Text>
      </View>
      <FlatList
        data={listaAtiva?.itens || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() =>
          !loading && (
            <Text style={styles.listaVaziaTexto}>
              {listaAtivaId ? "A sua lista está vazia." : "Nenhuma lista selecionada ou criada."}
            </Text>
          )
        }
        contentContainerStyle={listaAtiva?.itens?.length === 0 ? { flex: 1, justifyContent: 'center' } : {}}
      />
      {listaAtiva && listaAtiva.itens && listaAtiva.itens.length > 0 && (
        <Pressable style={styles.fabSummary} onPress={() => setIsSummaryModalVisible(true)}>
          <Ionicons name="cash-outline" size={26} color={Cores.light.buttonText} />
        </Pressable>
      )}
      <Pressable style={styles.fab} onPress={() => setIsAddItemModalVisible(true)}>
        <Ionicons name="add" size={30} color={Cores.light.buttonText} />
      </Pressable>

      {listaAtivaId && listaAtiva && (
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
