import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ListContext } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";

const Cores = {
  roxoPrincipal: "#8B5CF6",
  roxoClaro: "#A78BFA",
  cinzaFundo: "#F3F4F6",
  cinzaInput: "#E5E7EB",
  branco: "#FFFFFF",
  pretoTexto: "#1F2937",
  cinzaTexto: "#6B7281",
  vermelhoExcluir: "#EF4444",
  cinzaFundoEscuro: "#1F2937",
  brancoEscuro: "#2D3748",
  pretoTextoEscuro: "#E5E7EB",
  cinzaTextoEscuro: "#9CA3AF",
};

const IconeAdicionar = () => (
  <Text style={{ color: Cores.branco, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = () => (
  <Text style={{ color: Cores.vermelhoExcluir, fontSize: 20 }}>🗑️</Text>
);

interface ThemeStyles {
  container: { backgroundColor: string };
  section: { backgroundColor: string; borderColor: string };
  title: { color: string };
  label: { color: string };
  value: { color: string };
  button: { backgroundColor: string };
  buttonText: { color: string };
  modalContainer: { backgroundColor: string };
  modalContent: { backgroundColor: string };
  input: { backgroundColor: string; color: string; borderColor: string };
  itemListaContainer: { backgroundColor: string; borderColor: string };
  emptyContainer: { backgroundColor: string };
  placeholderText: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function ListsScreen() {
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeLista, setNomeLista] = useState("");
  const [editandoListaId, setEditandoListaId] = useState<string | null>(null);

  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: Cores.cinzaFundo },
      section: { backgroundColor: Cores.branco, borderColor: Cores.cinzaInput },
      title: { color: Cores.pretoTexto },
      label: { color: Cores.pretoTexto },
      value: { color: Cores.cinzaTexto },
      button: { backgroundColor: Cores.roxoPrincipal },
      buttonText: { color: Cores.branco },
      modalContainer: { backgroundColor: "rgba(0,0,0,0.5)" },
      modalContent: { backgroundColor: Cores.branco },
      input: {
        backgroundColor: Cores.branco,
        color: Cores.pretoTexto,
        borderColor: Cores.cinzaInput,
      },
      itemListaContainer: {
        backgroundColor: Cores.branco,
        borderColor: Cores.cinzaInput,
      },
      emptyContainer: { backgroundColor: Cores.cinzaFundo },
      placeholderText: { color: Cores.cinzaTexto },
    },
    dark: {
      container: { backgroundColor: Cores.cinzaFundoEscuro },
      section: {
        backgroundColor: Cores.brancoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      title: { color: Cores.pretoTextoEscuro },
      label: { color: Cores.pretoTextoEscuro },
      value: { color: Cores.cinzaTextoEscuro },
      button: { backgroundColor: Cores.roxoClaro },
      buttonText: { color: Cores.branco },
      modalContainer: { backgroundColor: "rgba(255,255,255,0.2)" },
      modalContent: { backgroundColor: Cores.brancoEscuro },
      input: {
        backgroundColor: Cores.brancoEscuro,
        color: Cores.pretoTextoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      itemListaContainer: {
        backgroundColor: Cores.brancoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      emptyContainer: { backgroundColor: Cores.cinzaFundoEscuro },
      placeholderText: { color: Cores.cinzaTextoEscuro },
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? 25 : 0,
      ...themeStyles[theme as keyof ThemeStylesMap].container,
    },
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    titulo: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "left",
      ...themeStyles[theme as keyof ThemeStylesMap].title,
    },
    botaoContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
      alignItems: "flex-end",
    },
    botao: {
      width: 55,
      height: 55,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].button,
      elevation: 8,
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
      ...themeStyles[theme as keyof ThemeStylesMap].itemListaContainer,
    },
    checkboxArea: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    itemListaTexto: {
      fontSize: 18,
      flexShrink: 1,
      ...themeStyles[theme as keyof ThemeStylesMap].label,
    },
    acoesItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    botaoAcao: {
      padding: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
      paddingHorizontal: 20,
      ...themeStyles[theme as keyof ThemeStylesMap].emptyContainer,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 10,
      ...themeStyles[theme as keyof ThemeStylesMap].title,
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      ...themeStyles[theme as keyof ThemeStylesMap].value,
    },
    botaoCriar: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].button,
    },
    textoBotaoCriar: {
      fontSize: 18,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].buttonText,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].modalContainer,
    },
    modalContent: {
      borderRadius: 12,
      padding: 20,
      width: "80%",
      alignItems: "center",
      ...themeStyles[theme as keyof ThemeStylesMap].modalContent,
    },
    modalTitulo: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      ...themeStyles[theme as keyof ThemeStylesMap].title,
    },
    input: {
      width: "100%",
      height: 55,
      paddingHorizontal: 20,
      borderRadius: 12,
      fontSize: 16,
      marginBottom: 20,
      borderWidth: 1,
      ...themeStyles[theme as keyof ThemeStylesMap].input,
    },
    modalBotoes: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    botaoModal: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      alignItems: "center",
      marginHorizontal: 5,
    },
    botaoCancelar: {
      ...themeStyles[theme as keyof ThemeStylesMap].button,
      backgroundColor:
        theme === "light" ? Cores.cinzaInput : Cores.cinzaTextoEscuro,
    },
    botaoSalvar: {
      ...themeStyles[theme as keyof ThemeStylesMap].button,
    },
    textoBotaoModal: {
      fontSize: 16,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].buttonText,
    },
  });

  const handleSalvarLista = () => {
    if (nomeLista.trim() === "") {
      Alert.alert("Erro", "O nome da lista não pode estar vazio.");
      return;
    }

    if (editandoListaId) {
      const novasListas = todasAsListas.map((lista) =>
        lista.id === editandoListaId ? { ...lista, nome: nomeLista } : lista
      );
      setTodasAsListas(novasListas);
    } else {
      const novaLista = {
        id: Date.now().toString(),
        nome: nomeLista,
        itens: [],
      };
      setTodasAsListas([...todasAsListas, novaLista]);
    }

    setNomeLista("");
    setEditandoListaId(null);
    setModalVisivel(false);
  };

  const handleExcluirLista = (id: string) => {
    if (todasAsListas.length === 1) {
      Alert.alert("Erro", "Não é possível excluir a última lista.");
      return;
    }

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const novasListas = todasAsListas.filter(
              (lista) => lista.id !== id
            );
            setTodasAsListas(novasListas);
            if (listaAtivaId === id) {
              setListaAtivaId(novasListas[0].id);
            }
          },
        },
      ]
    );
  };

  const handleEditarLista = (id: string, nome: string) => {
    setEditandoListaId(id);
    setNomeLista(nome);
    setModalVisivel(true);
  };

  const handleSelecionarLista = (id: string) => {
    setListaAtivaId(id);
    router.push("/");
  };

  const renderLista = ({ item }: { item: { id: string; nome: string } }) => (
    <Pressable
      onPress={() => handleSelecionarLista(item.id)}
      style={styles.itemListaContainer}
    >
      <View style={styles.checkboxArea}>
        <Text style={styles.itemListaTexto}>
          {item.nome} {item.id === listaAtivaId && "(Ativa)"}
        </Text>
      </View>
      <View style={styles.acoesItem}>
        <Pressable
          onPress={() => handleEditarLista(item.id, item.nome)}
          style={styles.botaoAcao}
        >
          <Ionicons
            name="pencil-outline"
            size={20}
            color={theme === "light" ? Cores.roxoPrincipal : Cores.roxoClaro}
          />
        </Pressable>
        <Pressable
          onPress={() => handleExcluirLista(item.id)}
          style={[styles.botaoAcao, { marginLeft: 8 }]}
        >
          <IconeLixeira />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Minhas Listas</Text>
      </View>
      <View style={styles.botaoContainer}>
        <Pressable
          style={styles.botao}
          onPress={() => {
            setEditandoListaId(null);
            setNomeLista("");
            setModalVisivel(true);
          }}
        >
          <IconeAdicionar />
        </Pressable>
      </View>
      <FlatList
        data={todasAsListas}
        renderItem={renderLista}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="file-tray-outline"
              size={60}
              color={
                theme === "light" ? Cores.cinzaTexto : Cores.cinzaTextoEscuro
              }
            />
            <Text style={styles.emptyTitle}>Nenhuma lista criada</Text>
            <Text style={styles.emptySubtitle}>
              Comece criando sua primeira lista de compras!
            </Text>
            <Pressable
              style={styles.botaoCriar}
              onPress={() => {
                setEditandoListaId(null);
                setNomeLista("");
                setModalVisivel(true);
              }}
            >
              <Text style={styles.textoBotaoCriar}>Criar Nova Lista</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editandoListaId ? "Renomear Lista" : "Nova Lista"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da lista..."
              placeholderTextColor={
                themeStyles[theme as keyof ThemeStylesMap].placeholderText.color
              }
              value={nomeLista}
              onChangeText={setNomeLista}
              autoFocus={true}
            />
            <View style={styles.modalBotoes}>
              <Pressable
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setModalVisivel(false)}
              >
                <Text style={styles.textoBotaoModal}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.botaoModal, styles.botaoSalvar]}
                onPress={handleSalvarLista}
              >
                <Text style={styles.textoBotaoModal}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
