import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function ListfyScreen() {
  // --- Estados da nossa aplicação ---
  const [item, setItem] = useState("");
  const [lista, setLista] = useState<string[]>([]); // Definimos o tipo do array como string[]

  // --- Funções da nossa aplicação ---
  const handleAdicionarItem = () => {
    if (item.trim() !== "") {
      setLista([...lista, item]);
      setItem("");
    }
  };

  // --- Interface do nosso aplicativo ---
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.titulo}>Listfy</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um item..."
          placeholderTextColor="#888"
          value={item}
          onChangeText={setItem}
        />
        <Button
          title="Adicionar"
          onPress={handleAdicionarItem}
          color="#007AFF"
        />
      </View>

      <FlatList
        data={lista}
        renderItem={({ item }) => <Text style={styles.itemLista}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        // Adiciona um texto caso a lista esteja vazia
        ListEmptyComponent={() => (
          <Text style={styles.listaVazia}>
            Sua lista de compras está vazia.
          </Text>
        )}
      />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "#1e1e1e",
    color: "#FFF",
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemLista: {
    color: "#FFF",
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 18,
  },
  listaVazia: {
    color: "#888",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
