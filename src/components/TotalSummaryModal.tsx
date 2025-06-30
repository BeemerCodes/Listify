import React, { useContext } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Item } from "../context/ListContext";
import { ThemeContext } from "../context/ThemeContext";
import { Cores } from "../../constants/Colors"; // Importar Cores centralizadas

interface TotalSummaryModalProps {
  visible: boolean;
  onClose: () => void;
  items: Item[];
  listName: string;
}

const TotalSummaryModal: React.FC<TotalSummaryModalProps> = ({
  visible,
  onClose,
  items,
  listName,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;

  const formatCurrency = (value: number | undefined) => {
    if (typeof value !== "number" || isNaN(value)) return "R$ 0,00";
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  const itemsComValor = items.filter(item => (item.valorTotalItem ?? 0) > 0 || (item.valorUnitario ?? 0) > 0);
  const totalGeral = itemsComValor.reduce(
    (sum, item) => sum + (item.valorTotalItem || 0),
    0
  );

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    modalContent: {
      width: "90%",
      maxWidth: 500,
      maxHeight: "80%",
      backgroundColor: Cores[currentColorScheme].cardBackground,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      color: Cores[currentColorScheme].text,
    },
    listNameText: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 15,
      textAlign: "center",
      color: Cores[currentColorScheme].textSecondary,
    },
    scrollViewContent: {
      paddingBottom: 10,
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: Cores[currentColorScheme].borderColor,
    },
    itemTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    itemName: {
      fontSize: 16,
      color: Cores[currentColorScheme].text,
      fontWeight: "500",
    },
    itemDetails: {
      fontSize: 13,
      color: Cores[currentColorScheme].textSecondary,
    },
    itemSubtotal: {
      fontSize: 16,
      fontWeight: "500",
      color: Cores[currentColorScheme].text,
    },
    totalGeralContainer: {
      marginTop: 15,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: Cores[currentColorScheme].borderColor,
      alignItems: "flex-end", // Alinha o texto do total à direita
    },
    totalGeralText: {
      fontSize: 18,
      fontWeight: "bold",
      color: Cores[currentColorScheme].tint, // Usar a cor de tint para o total geral
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText,
    },
    emptyText: {
      textAlign: 'center',
      fontSize: 16,
      color: Cores[currentColorScheme].textSecondary,
      marginTop: 20,
      paddingVertical: 20,
    }
  });

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Resumo da Lista</Text>
          <Text style={styles.listNameText}>{listName}</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {itemsComValor.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum item com valor na lista.</Text>
            ) : (
              itemsComValor.map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.texto}</Text>
                    <Text style={styles.itemDetails}>
                      {item.quantidade} x {formatCurrency(item.valorUnitario)}
                    </Text>
                  </View>
                  <Text style={styles.itemSubtotal}>
                    {formatCurrency(item.valorTotalItem)}
                  </Text>
                </View>
              ))
            )}
            {itemsComValor.length > 0 && (
                 <View style={styles.totalGeralContainer}>
                    <Text style={styles.totalGeralText}>
                    Total Geral: {formatCurrency(totalGeral)}
                    </Text>
                </View>
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default TotalSummaryModal;
