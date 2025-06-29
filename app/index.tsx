import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";

interface Item {
  id: string;
  texto: string;
  quantidade: number;
  comprado: boolean;
}

interface ListaDeCompras {
  id: string;
  nome: string;
  itens: Item[];
}

const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  cinzaInput: "#E5E7EB",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  cinzaRiscado: "#9CA3AF",
  vermelhoExcluir: "#EF4444",
};

const IconeAdicionar = () => (
  <Text style={{ color: Cores.branco, fontSize: 24, lineHeight: 24 }}>+</Text>
);
const IconeLixeira = () => (
  <Text style={{ color: Cores.vermelhoExcluir, fontSize: 20 }}>🗑️</Text>
);

export default function CurrentListScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [todasAsListas, setTodasAsListas] = useState<ListaDeCompras[]>([
    {
      id: "1",
      nome: "🛒 Compras do Mês",
      itens: [
        { id: "101", texto: "Leite Integral", quantidade: 2, comprado: false },
        { id: "102", texto: "Pão de Forma", quantidade: 1, comprado: true },
      ],
    },
    {
      id: "2",
      nome: "🎉 Festa de Aniversário",
      itens: [],
    },
  ]);
  const [listaAtivaId, setListaAtivaId] = useState("1");
  const [itemTexto, setItemTexto] = useState("");

  const listaAtiva = todasAsListas.find((l) => l.id === listaAtivaId);

  const adicionarItemDaAPI = (texto: string) => {
    if (!listaAtiva) return;
    const novoItem: Item = {
      id: Date.now().toString(),
      texto: texto,
      quantidade: 1,
      comprado: false,
    };
    const novasListas = todasAsListas.map((lista) =>
      lista.id === listaAtivaId
        ? { ...lista, itens: [novoItem, ...lista.itens] }
        : lista
    );
    setTodasAsListas(novasListas);
  };

  const handleAdicionarItem = () => {
    if (itemTexto.trim() === "" || !listaAtiva) return;
    const novoItem: Item = {
      id: Date.now().toString(),
      texto: itemTexto,
      quantidade: 1,
      comprado: false,
    };
    const novasListas = todasAsListas.map((lista) =>
      lista.id === listaAtivaId
        ? { ...lista, itens: [novoItem, ...lista.itens] }
        : lista
    );
    setTodasAsListas(novasListas);
    setItemTexto("");
    Keyboard.dismiss();
  };

  const handleMudarQuantidade = (itemId: string, delta: number) => {
    if (!listaAtiva) return;
    const novasListas = todasAsListas.map((lista) => {
      if (lista.id === listaAtivaId) {
        const novosItens = lista.itens.map((item) => {
          if (item.id === itemId) {
            const novaQuantidade = item.quantidade + delta;
            return {
              ...item,
              quantidade: novaQuantidade > 0 ? novaQuantidade : 1,
            };
          }
          return item;
        });
        return { ...lista, itens: novosItens };
      }
      return lista;
    });
    setTodasAsListas(novasListas);
  };

  const handleMarcarItem = (itemId: string) => {
    if (!listaAtiva) return;
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
    if (!listaAtiva) return;
    const novasListas = todasAsListas.map((l) =>
      l.id === listaAtivaId
        ? { ...l, itens: l.itens.filter((i) => i.id !== itemId) }
        : l
    );
    setTodasAsListas(novasListas);
  };

  useEffect(() => {
    if (params.novoItem && typeof params.novoItem === "string") {
      adicionarItemDaAPI(params.novoItem);
      router.setParams({ novoItem: "" });
    }
  }, [params.novoItem]);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemListaContainer}>
      <Pressable
        onPress={() => handleMarcarItem(item.id)}
        style={styles.checkboxArea}
      >
        <View
          style={[styles.checkbox, item.comprado && styles.checkboxComprado]}
        >
          {item.comprado && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <View>
          <Text
            style={[
              styles.itemListaTexto,
              item.comprado && styles.itemTextoComprado,
            ]}
          >
            {item.texto}
          </Text>
          <Text
            style={[
              styles.itemQuantidadeTexto,
              item.comprado && styles.itemTextoComprado,
            ]}
          >
            Quantidade: {item.quantidade}
          </Text>
        </View>
      </Pressable>
      <View style={styles.acoesItem}>
        <Pressable
          onPress={() => handleMudarQuantidade(item.id, -1)}
          style={styles.botaoAcao}
        >
          <Text style={styles.textoBotaoAcao}>-</Text>
        </Pressable>
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
          <IconeLixeira />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Cores.cinzaFundo} />

      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>
          {listaAtiva?.nome || "Nenhuma lista selecionada"}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar item..."
          value={itemTexto}
          onChangeText={setItemTexto}
          onSubmitEditing={handleAdicionarItem}
        />
        <Pressable style={styles.botao} onPress={handleAdicionarItem}>
          <IconeAdicionar />
        </Pressable>
      </View>

      <FlatList
        data={listaAtiva?.itens || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.listaVaziaTexto}>Esta lista está vazia.</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.cinzaFundo,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: { paddingVertical: 20, paddingHorizontal: 20 },
  titulo: {
    fontSize: 36,
    fontWeight: "bold",
    color: Cores.pretoTexto,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: Cores.branco,
    color: Cores.pretoTexto,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Cores.cinzaInput,
  },
  botao: {
    width: 55,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Cores.roxoPrincipal,
    elevation: 8,
  },
  listaVaziaTexto: {
    fontSize: 16,
    color: Cores.cinzaTexto,
    textAlign: "center",
    marginTop: 50,
  },
  itemListaContainer: {
    backgroundColor: Cores.branco,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Cores.cinzaInput,
  },
  checkboxArea: { flexDirection: "row", alignItems: "center", flex: 1 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Cores.cinzaInput,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  checkboxComprado: {
    backgroundColor: Cores.roxoPrincipal,
    borderColor: Cores.roxoPrincipal,
  },
  checkboxCheck: { color: Cores.branco, fontWeight: "bold" },
  itemListaTexto: { fontSize: 18, color: Cores.pretoTexto },
  itemTextoComprado: {
    textDecorationLine: "line-through",
    color: Cores.cinzaRiscado,
  },
  itemQuantidadeTexto: { fontSize: 14, color: Cores.cinzaTexto },
  acoesItem: { flexDirection: "row", alignItems: "center" },
  botaoAcao: { padding: 8 },
  textoBotaoAcao: {
    fontSize: 20,
    color: Cores.roxoPrincipal,
    fontWeight: "bold",
  },
});
