import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import { ListContext, Item } from "../context/ListContext";
import { Cores } from "../../constants/Colors"; // Importar Cores centralizadas

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  listaId: string | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  listaId,
}) => {
  const { theme } = useContext(ThemeContext);
  const currentColorScheme = theme as keyof typeof Cores;
  const { todasAsListas, setTodasAsListas } = useContext(ListContext);

  const [nomeItem, setNomeItem] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [valorUnitario, setValorUnitario] = useState("");
  const [valorTotalItem, setValorTotalItem] = useState(0);

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)", // Overlay semi-transparente
    },
    keyboardView: {
      width: "90%",
      maxWidth: 400,
      backgroundColor: Cores[currentColorScheme].cardBackground, // Usar cardBackground
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
      marginBottom: 20,
      textAlign: "center",
      color: Cores[currentColorScheme].text,
    },
    input: {
      backgroundColor: Cores[currentColorScheme].inputBackground,
      color: Cores[currentColorScheme].text,
      paddingHorizontal: 15,
      paddingVertical: Platform.OS === "ios" ? 15 : 10,
      borderRadius: 8,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: Cores[currentColorScheme].inputBorder,
    },
    totalItemText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "right",
      color: Cores[currentColorScheme].text,
      fontWeight: "500",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButton: {
      backgroundColor: Cores[currentColorScheme].buttonPrimaryBackground,
      marginRight: 5,
    },
    cancelButton: {
      backgroundColor: Cores[currentColorScheme].buttonSecondaryBackground,
      marginLeft: 5,
    },
    buttonText: { // Para o botão Salvar
      fontSize: 16,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonText, // Texto do botão primário
    },
    cancelButtonText: { // Para o botão Cancelar
      fontSize: 16,
      fontWeight: "bold",
      color: Cores[currentColorScheme].buttonSecondaryText, // Texto do botão secundário
    }
  });

  useEffect(() => {
    const quant = parseFloat(quantidade) || 0;
    const valor = parseFloat(valorUnitario.replace(",", ".")) || 0;
    setValorTotalItem(quant * valor);
  }, [quantidade, valorUnitario]);

  const handleAddItem = () => {
    if (!nomeItem.trim() || !listaId) {
      return;
    }
    const newItem: Item = {
      id: Date.now().toString(),
      texto: nomeItem.trim(),
      quantidade: parseFloat(quantidade) || 1,
      valorUnitario: parseFloat(valorUnitario.replace(",", ".")) || 0,
      valorTotalItem: valorTotalItem,
      comprado: false,
    };
    const updatedListas = todasAsListas.map((lista) => {
      if (lista.id === listaId) {
        return { ...lista, itens: [...lista.itens, newItem] };
      }
      return lista;
    });
    setTodasAsListas(updatedListas);
    resetFieldsAndClose();
  };

  const resetFieldsAndClose = () => {
    setNomeItem("");
    setQuantidade("1");
    setValorUnitario("");
    setValorTotalItem(0);
    onClose();
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}`;
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={resetFieldsAndClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.keyboardView}>
          <Text style={styles.modalTitle}>Adicionar Novo Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do item"
            placeholderTextColor={Cores[currentColorScheme].placeholderText}
            value={nomeItem}
            onChangeText={setNomeItem}
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            placeholderTextColor={Cores[currentColorScheme].placeholderText}
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor Unitário (ex: 10,50)"
            placeholderTextColor={Cores[currentColorScheme].placeholderText}
            keyboardType="decimal-pad"
            value={valorUnitario}
            onChangeText={setValorUnitario}
          />
          <Text style={styles.totalItemText}>
            Total do Item: {formatCurrency(valorTotalItem)}
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={resetFieldsAndClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleAddItem}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddItemModal;
