import React, { useContext } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList, // Usar FlatList para os itens
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { Cores } from '../../constants/Colors';
import { ListaDeCompras, Item } from '../context/ListContext'; // Importar tipos

interface ViewListItemsModalProps {
  visible: boolean;
  onClose: () => void;
  lista: ListaDeCompras | null;
}

const ViewListItemsModal: React.FC<ViewListItemsModalProps> = ({
  visible,
  onClose,
  lista,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;

  if (!lista) {
    return null; // Não renderizar nada se a lista for nula
  }

  const isListaTarefasModal = lista.nome.toLowerCase() === "tarefas";

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace('.', ',').replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, '$1.')}`;
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
      width: '90%',
      maxWidth: 500,
      maxHeight: '80%',
      backgroundColor: Cores[currentColorScheme].cardBackground,
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20, // Um pouco menor que AddItemModal
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
      color: Cores[currentColorScheme].text,
    },
    modalSubtitle: { // Para o nome da lista
      fontSize: 16,
      marginBottom: 15,
      textAlign: 'center',
      color: Cores[currentColorScheme].textSecondary,
    },
    itemContainer: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: Cores[currentColorScheme].borderColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 16,
      color: Cores[currentColorScheme].text,
      flex: 3, // Dar mais espaço para o nome do item
    },
    itemQuantity: {
      fontSize: 15,
      color: Cores[currentColorScheme].textSecondary,
      flex: 1,
      textAlign: 'center',
    },
    itemTotalValue: {
      fontSize: 15,
      color: Cores[currentColorScheme].textSecondary,
      flex: 2, // Dar um pouco mais de espaço para o valor
      textAlign: 'right',
    },
    emptyListText: {
      fontSize: 16,
      color: Cores[currentColorScheme].textSecondary,
      textAlign: 'center',
      marginTop: 20,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Cores[currentColorScheme].buttonText,
    },
  });

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText} numberOfLines={2}>{item.texto}</Text>
      {!isListaTarefasModal && (
        <>
          <Text style={styles.itemQuantity}>Qtd: {item.quantidade}</Text>
          <Text style={styles.itemTotalValue}>{formatCurrency(item.valorTotalItem)}</Text>
        </>
      )}
    </View>
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Itens da Lista</Text>
          <Text style={styles.modalSubtitle}>{lista.nome}</Text>
          {lista.itens.length > 0 ? (
            <FlatList
              data={lista.itens}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={styles.emptyListText}>Esta lista não possui itens.</Text>
          )}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ViewListItemsModal;
