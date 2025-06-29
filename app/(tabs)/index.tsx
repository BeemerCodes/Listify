import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Pressable,
  Keyboard,
  Platform,
} from "react-native";

// --- Paleta de Cores (com uma nova cor para itens riscados) ---
const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  cinzaInput: "#E5E7EB",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  cinzaRiscado: "#9CA3AF", // Nova cor
  vermelhoExcluir: "#EF4444", // Nova cor para o botão de excluir
};

// --- Nossa nova estrutura para cada item da lista ---
interface ItemLista {
  id: string;
  texto: string;
  comprado: boolean;
}

// --- Componentes de Ícones ---
const IconeAdicionar = () => (
  <Text style={{ color: Cores.branco, fontSize: 24, lineHeight: 24 }}>+</Text>
);
const IconeLixeira = () => (
  <Text style={{ color: Cores.vermelhoExcluir, fontSize: 20 }}>🗑️</Text>
); // Ícone de lixeira

export default function HomeScreen() {
  const [itemTexto, setItemTexto] = useState("");
  // Nosso estado agora é uma lista de objetos do tipo ItemLista
  const [lista, setLista] = useState<ItemLista[]>([]);

  // --- Novas Funções ---
  const handleAdicionarItem = () => {
    if (itemTexto.trim() === "") return;

    const novoItem: ItemLista = {
      id: Date.now().toString(), // ID único baseado no tempo atual
      texto: itemTexto,
      comprado: false, // Todo item novo começa como "não comprado"
    };

    setLista((prevLista) => [novoItem, ...prevLista]);
    setItemTexto("");
    Keyboard.dismiss();
  };

  const handleMarcarItem = (id: string) => {
    setLista((prevLista) =>
      prevLista.map((item) =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    );
  };

  const handleRemoverItem = (id: string) => {
    setLista((prevLista) => prevLista.filter((item) => item.id !== id));
  };

  // --- Componente para renderizar cada item da lista ---
  const renderItem = ({ item }: { item: ItemLista }) => (
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
        <Text
          style={[
            styles.itemListaTexto,
            item.comprado && styles.itemTextoComprado,
          ]}
        >
          {item.texto}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleRemoverItem(item.id)}
        style={styles.botaoExcluir}
      >
        <IconeLixeira />
      </Pressable>
    </View>
  );

  // --- Interface Principal ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Cores.cinzaFundo} />

      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Listfy</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Maçãs, Leite, Pão..."
          placeholderTextColor={Cores.cinzaTexto}
          value={itemTexto}
          onChangeText={setItemTexto}
          onSubmitEditing={handleAdicionarItem}
        />
        <Pressable
          style={({ pressed }) => [
            styles.botao,
            {
              backgroundColor: pressed ? Cores.roxoClaro : Cores.roxoPrincipal,
            },
          ]}
          onPress={handleAdicionarItem}
        >
          <IconeAdicionar />
        </Pressable>
      </View>

      <FlatList
        data={lista}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={styles.listaVaziaContainer}>
            <Text style={styles.listaVaziaTexto}>
              Sua lista de compras aparecerá aqui.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// --- Nova Folha de Estilos ---
const styles = StyleSheet.create({
  // Estilos do container, header, input, etc., continuam os mesmos...
  container: {
    flex: 1,
    backgroundColor: Cores.cinzaFundo,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
    shadowColor: Cores.roxoPrincipal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  listaVaziaContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  listaVaziaTexto: {
    fontSize: 16,
    color: Cores.cinzaTexto,
    textAlign: "center",
  },
  // --- Novos estilos para os itens da lista ---
  itemListaContainer: {
    backgroundColor: Cores.branco,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Cores.cinzaInput,
  },
  checkboxArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
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
  checkboxCheck: {
    color: Cores.branco,
    fontWeight: "bold",
  },
  itemListaTexto: {
    fontSize: 18,
    color: Cores.pretoTexto,
  },
  itemTextoComprado: {
    textDecorationLine: "line-through",
    color: Cores.cinzaRiscado,
  },
  botaoExcluir: {
    padding: 5,
  },
});
