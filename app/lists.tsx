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
  StatusBar, // Importar StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ListContext, ListaDeCompras } from "../src/context/ListContext"; // Importar ListaDeCompras
import { ThemeContext } from "../src/context/ThemeContext";
import { Cores } from "../constants/Colors"; // Importar Cores centralizadas

// IconeAdicionar agora usa cores do tema
const IconeAdicionar = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

// IconeLixeira agora usa cores do tema
const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

export default function ListsScreen() {
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;
  const router = useRouter();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeLista, setNomeLista] = useState("");
  const [editandoListaId, setEditandoListaId] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: Cores[currentColorScheme].background,
    },
    headerContainer: {
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    titulo: {
      fontSize: 36,
      fontWeight: "bold",
      textAlign: "left",
      color: Cores[currentColorScheme].text,
    },
    botaoContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
      alignItems: "flex-end",
    },
    botaoAddLista: { // Renomeado para clareza
      width: 55,
      height: 55,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      elevation: 8,
    },
    itemListaContainer: {
      paddingVertical: 15, // Aumentado
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
    itemNomeContainer: { // Renomeado de checkboxArea
      flex: 1,
      marginRight: 10, // Espaço antes dos botões de ação
    },
    itemListaTexto: {
      fontSize: 18,
      color: Cores[currentColorScheme].text,
    },
    itemListaAtivaTexto: { // Estilo para destacar lista ativa
        fontWeight: 'bold',
        color: Cores[currentColorScheme].tint,
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
      // backgroundColor não é mais necessário aqui, o container principal já tem
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginTop: 15,
      marginBottom: 10,
      color: Cores[currentColorScheme].text,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: Cores[currentColorScheme].textSecondary,
    },
    botaoCriar: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    textoBotaoCriar: {
      fontSize: 18,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
    // Estilos do Modal
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)", // Overlay mais escuro
    },
    modalContent: {
      borderRadius: 12,
      padding: 20,
      width: "90%", // Aumentado
      maxWidth: 400,
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].cardBackground,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitulo: {
      fontSize: 22, // Reduzido
      fontWeight: "bold",
      marginBottom: 20,
      color: Cores[currentColorScheme].text,
    },
    inputModal: { // Renomeado para clareza
      width: "100%",
      height: 55,
      paddingHorizontal: 20,
      borderRadius: 8, // Reduzido
      fontSize: 16,
      marginBottom: 25, // Aumentado
      borderWidth: 1,
      backgroundColor: Cores[currentColorScheme].inputBackground,
      color: Cores[currentColorScheme].text,
      borderColor: Cores[currentColorScheme].inputBorder,
    },
    modalBotoesContainer: { // Renomeado
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: { // Renomeado
      flex: 1,
      paddingVertical: 12, // Reduzido
      borderRadius: 8, // Reduzido
      alignItems: "center",
      marginHorizontal: 5,
    },
    modalCancelarButton: { // Renomeado
      backgroundColor: Cores[currentColorScheme].buttonSecondaryBackground,
    },
    modalSalvarButton: { // Renomeado
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    modalButtonText: { // Renomeado
      fontSize: 16,
      fontWeight: "bold",
    },
    // modalSalvarButtonText herdará de modalButtonText e usará Cores[currentColorScheme].buttonText
    // modalCancelarButtonText usará Cores[currentColorScheme].buttonSecondaryText
  });

  const handleSalvarLista = () => {
    if (nomeLista.trim() === "") {
      Alert.alert("Erro", "O nome da lista não pode estar vazio.");
      return;
    }
    if (editandoListaId) {
      const novasListas = todasAsListas.map((lista) =>
        lista.id === editandoListaId ? { ...lista, nome: nomeLista.trim() } : lista
      );
      setTodasAsListas(novasListas);
    } else {
      const novaLista: ListaDeCompras = { // Tipagem explícita
        id: Date.now().toString(),
        nome: nomeLista.trim(),
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
      Alert.alert("Atenção", "Não é possível excluir a única lista existente. Crie outra lista antes de excluir esta.");
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta lista? Todos os itens contidos nela serão perdidos.",
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
              setListaAtivaId(novasListas.length > 0 ? novasListas[0].id : ""); // Define a primeira como ativa ou nenhuma se não houver mais listas
            }
          },
        },
      ]
    );
  };

  const handleEditarLista = (lista: ListaDeCompras) => { // Recebe o objeto lista
    setEditandoListaId(lista.id);
    setNomeLista(lista.nome);
    setModalVisivel(true);
  };

  const handleSelecionarLista = (id: string) => {
    setListaAtivaId(id);
    router.push("/"); // Navega para a tela da lista atual
  };

  const renderLista = ({ item }: { item: ListaDeCompras }) => ( // Tipado para ListaDeCompras
    <Pressable
      onPress={() => handleSelecionarLista(item.id)}
      style={styles.itemListaContainer}
    >
      <View style={styles.itemNomeContainer}>
        <Text style={[styles.itemListaTexto, item.id === listaAtivaId && styles.itemListaAtivaTexto]}>
          {item.nome}
        </Text>
      </View>
      <View style={styles.acoesItem}>
        <Pressable
          onPress={() => handleEditarLista(item)}
          style={styles.botaoAcao}
        >
          <Ionicons
            name="pencil-outline"
            size={22} // Aumentado
            color={Cores[currentColorScheme].tint} // Usar tint
          />
        </Pressable>
        <Pressable
          onPress={() => handleExcluirLista(item.id)}
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
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>Minhas Listas</Text>
      </View>
      <View style={styles.botaoContainer}>
        <Pressable
          style={styles.botaoAddLista}
          onPress={() => {
            setEditandoListaId(null);
            setNomeLista("");
            setModalVisivel(true);
          }}
        >
          <IconeAdicionar currentTheme={currentColorScheme} />
        </Pressable>
      </View>
      <FlatList
        data={todasAsListas}
        renderItem={renderLista}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="file-tray-stacked-outline" // Ícone diferente
              size={70} // Aumentado
              color={Cores[currentColorScheme].textSecondary}
            />
            <Text style={styles.emptyTitle}>Nenhuma lista criada</Text>
            <Text style={styles.emptySubtitle}>
              Crie listas para organizar suas compras e tarefas!
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
        animationType="fade" // Mudado para fade
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
            setModalVisivel(false);
            setEditandoListaId(null); // Resetar ao fechar
            setNomeLista("");       // Resetar ao fechar
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>
              {editandoListaId ? "Renomear Lista" : "Nova Lista"}
            </Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Nome da lista..."
              placeholderTextColor={Cores[currentColorScheme].placeholderText}
              value={nomeLista}
              onChangeText={setNomeLista}
              autoFocus={true}
              onSubmitEditing={handleSalvarLista} // Salvar ao pressionar enter
            />
            <View style={styles.modalBotoesContainer}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelarButton]}
                onPress={() => {
                    setModalVisivel(false);
                    setEditandoListaId(null);
                    setNomeLista("");
                }}
              >
                <Text style={[styles.modalButtonText, { color: Cores[currentColorScheme].buttonSecondaryText }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalSalvarButton]}
                onPress={handleSalvarLista}
              >
                <Text style={[styles.modalButtonText, { color: Cores[currentColorScheme].buttonText }]}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
