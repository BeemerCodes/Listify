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
  Alert, // Manter Alert para confirmações
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ListContext, ListaDeCompras } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";
import { Cores } from "../constants/Colors";
import ViewListItemsModal from "../src/components/ViewListItemsModal";
import { showErrorToast, showInfoToast, showSuccessToast } from "../src/utils/toastService";

const IconeAdicionar = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].buttonText, fontSize: 24, lineHeight: 24 }}>+</Text>
);

const IconeLixeira = ({ currentTheme }: { currentTheme: 'light' | 'dark' }) => (
  <Text style={{ color: Cores[currentTheme].destructive, fontSize: 20 }}>🗑️</Text>
);

export default function ListsScreen() {
  const { todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;
  const router = useRouter();

  const [modalCriarEditarVisivel, setModalCriarEditarVisivel] = useState(false);
  const [nomeLista, setNomeLista] = useState("");
  const [editandoListaId, setEditandoListaId] = useState<string | null>(null);
  const [visualizandoLista, setVisualizandoLista] = useState<ListaDeCompras | null>(null);

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
    botaoAddLista: {
      width: 55,
      height: 55,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      elevation: 8,
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Cores[currentColorScheme].text,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 10,
    },
    itemListaContainer: {
      paddingVertical: 15,
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
    itemNomeContainer: {
      flex: 1,
      marginRight: 10,
    },
    itemListaTexto: {
      fontSize: 18,
      color: Cores[currentColorScheme].text,
    },
    itemListaAtivaTexto: {
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
      marginTop: 20,
      paddingHorizontal: 20,
      minHeight: 120,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      marginBottom: 8,
      color: Cores[currentColorScheme].text,
      textAlign: 'center',
    },
    emptySubtitle: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 15,
      color: Cores[currentColorScheme].textSecondary,
    },
    botaoCriar: {
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 10,
      alignItems: "center",
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    textoBotaoCriar: {
      fontSize: 16,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
      borderRadius: 12,
      padding: 20,
      width: "90%",
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
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      color: Cores[currentColorScheme].text,
    },
    inputModal: {
      width: "100%",
      height: 55,
      paddingHorizontal: 20,
      borderRadius: 8,
      fontSize: 16,
      marginBottom: 25,
      borderWidth: 1,
      backgroundColor: Cores[currentColorScheme].inputBackground,
      color: Cores[currentColorScheme].text,
      borderColor: Cores[currentColorScheme].inputBorder,
    },
    modalBotoesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
    modalCancelarButton: {
      backgroundColor: Cores[currentColorScheme].buttonSecondaryBackground,
    },
    modalSalvarButton: {
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  const listasAtivas = todasAsListas.filter(lista => !lista.isArchived);
  const listasArquivadas = todasAsListas.filter(lista => lista.isArchived);

  const handleSalvarLista = () => {
    if (nomeLista.trim() === "") {
      showErrorToast("O nome da lista não pode estar vazio.", "Nome Inválido");
      return;
    }
    if (editandoListaId) {
      const novasListas = todasAsListas.map((lista) =>
        lista.id === editandoListaId ? { ...lista, nome: nomeLista.trim() } : lista
      );
      setTodasAsListas(novasListas);
      showSuccessToast("Lista renomeada com sucesso!", "Sucesso");
    } else {
      const novaLista: ListaDeCompras = {
        id: Date.now().toString(),
        nome: nomeLista.trim(),
        itens: [],
        isArchived: false,
      };
      setTodasAsListas([...todasAsListas, novaLista]);
      showSuccessToast(`Lista "${novaLista.nome}" criada!`, "Sucesso");
    }
    setNomeLista("");
    setEditandoListaId(null);
    setModalCriarEditarVisivel(false);
  };

  const handleExcluirLista = (id: string) => {
    const listaParaExcluir = todasAsListas.find(l => l.id === id);
    if (!listaParaExcluir) return;

    if (todasAsListas.length === 1) {
      showErrorToast("Você precisa ter pelo menos uma lista. Crie uma nova antes de tentar excluir esta.", "Ação não permitida");
      return;
    }

    Alert.alert( // Confirmação de exclusão permanece Alert.alert
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a lista "${listaParaExcluir.nome}"? Todos os itens contidos nela serão perdidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            const novasListas = todasAsListas.filter((lista) => lista.id !== id);
            setTodasAsListas(novasListas);
            if (listaAtivaId === id) {
              const proximaListaNaoArquivada = novasListas.find(l => !l.isArchived);
              setListaAtivaId(proximaListaNaoArquivada ? proximaListaNaoArquivada.id : (novasListas.length > 0 ? novasListas[0].id : ""));
            }
            showInfoToast(`A lista "${listaParaExcluir.nome}" foi excluída.`, "Lista Excluída");
          },
        },
      ]
    );
  };

  const handleAbrirModalEditar = (lista: ListaDeCompras) => {
    if (lista.isArchived) {
      showInfoToast("Listas arquivadas não podem ser editadas. Por favor, desarquive a lista primeiro.", "Atenção");
      return;
    }
    setEditandoListaId(lista.id);
    setNomeLista(lista.nome);
    setModalCriarEditarVisivel(true);
  };

  const handleVisualizarItens = (lista: ListaDeCompras) => {
    setVisualizandoLista(lista);
  };

  const handleDefinirComoAtiva = (listaId: string) => {
    const listaSelecionada = todasAsListas.find(l => l.id === listaId);
    if (listaSelecionada && listaSelecionada.isArchived) {
        showInfoToast("Esta lista está arquivada. Desarquive-a para torná-la ativa.", "Lista Arquivada");
        return;
    }
    setListaAtivaId(listaId);
    router.push("/");
    if (listaSelecionada) { // Adicionar verificação se listaSelecionada existe
        showSuccessToast(`"${listaSelecionada.nome}" é agora sua lista ativa.`, "Lista Ativa");
    }
  };

  const handleUnarchiveList = (listId: string) => {
    const lista = todasAsListas.find(l => l.id === listId);
    setTodasAsListas(prevListas =>
      prevListas.map(l =>
        l.id === listId ? { ...l, isArchived: false } : l
      )
    );
    if(lista){
        showInfoToast(`A lista "${lista.nome}" foi desarquivada.`, "Lista Desarquivada");
    }
  };

  const renderListaItem = ({ item }: { item: ListaDeCompras }) => (
    <TouchableOpacity
      onPress={() => handleVisualizarItens(item)}
      onLongPress={() => handleDefinirComoAtiva(item.id)}
      delayLongPress={300}
      style={[styles.itemListaContainer, item.isArchived && { opacity: 0.6 }]}
    >
      <View style={styles.itemNomeContainer}>
        <Text style={[styles.itemListaTexto, item.id === listaAtivaId && !item.isArchived && styles.itemListaAtivaTexto]}>
          {item.nome} {item.isArchived && "(Arquivada)"}
        </Text>
      </View>
      <View style={styles.acoesItem}>
        {!item.isArchived && (
          <Pressable
            onPress={() => handleAbrirModalEditar(item)}
            style={styles.botaoAcao}
          >
            <Ionicons
              name="pencil-outline"
              size={22}
              color={Cores[currentColorScheme].tint}
            />
          </Pressable>
        )}
        {item.isArchived && (
           <Pressable
            onPress={() => handleUnarchiveList(item.id)}
            style={styles.botaoAcao}
          >
            <Ionicons
              name="archive-outline"
              size={22}
              color={Cores[currentColorScheme].tint}
            />
          </Pressable>
        )}
        <Pressable
          onPress={() => handleExcluirLista(item.id)}
          style={[styles.botaoAcao, { marginLeft: (item.isArchived || !item.isArchived) ? 8 : 0 }]} // Simplificado
        >
          <IconeLixeira currentTheme={currentColorScheme} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = (isArchivedSection: boolean) => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={isArchivedSection ? "archive-outline" : "file-tray-outline"}
        size={40}
        color={Cores[currentColorScheme].textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {isArchivedSection ? "Nenhuma lista arquivada" : "Nenhuma lista ativa"}
      </Text>
      {!isArchivedSection && (
          <Text style={styles.emptySubtitle}>
            Crie uma nova lista para começar!
        </Text>
      )}
    </View>
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
            setModalCriarEditarVisivel(true);
          }}
        >
          <IconeAdicionar currentTheme={currentColorScheme} />
        </Pressable>
      </View>

      <ScrollView>
        <Text style={styles.sectionHeader}>Listas Ativas</Text>
        {listasAtivas.length > 0 ? (
          <FlatList
            data={listasAtivas}
            renderItem={renderListaItem}
            keyExtractor={(item) => `ativa-${item.id}`}
            scrollEnabled={false}
          />
        ) : (
          renderEmptyComponent(false)
        )}

        <Text style={styles.sectionHeader}>Listas Arquivadas</Text>
        {listasArquivadas.length > 0 ? (
          <FlatList
            data={listasArquivadas}
            renderItem={renderListaItem}
            keyExtractor={(item) => `arquivada-${item.id}`}
            scrollEnabled={false}
          />
        ) : (
          renderEmptyComponent(true)
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCriarEditarVisivel}
        onRequestClose={() => {
            setModalCriarEditarVisivel(false);
            setEditandoListaId(null);
            setNomeLista("");
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
              onSubmitEditing={handleSalvarLista}
            />
            <View style={styles.modalBotoesContainer}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelarButton]}
                onPress={() => {
                    setModalCriarEditarVisivel(false);
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

      {visualizandoLista && (
        <ViewListItemsModal
            visible={!!visualizandoLista}
            onClose={() => setVisualizandoLista(null)}
            lista={visualizandoLista}
        />
      )}
    </SafeAreaView>
  );
}
