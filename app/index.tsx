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
  TextInput,
} from "react-native";
import { ListContext, Item } from "../src/context/ListContext";
import { ThemeContext } from "../src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

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
  input: { backgroundColor: string; color: string; borderColor: string };
  itemListaContainer: { backgroundColor: string; borderColor: string };
  listaVaziaTexto: { color: string };
  checkbox: { borderColor: string };
  checkboxComprado: { backgroundColor: string; borderColor: string };
  textoBotaoAcao: { color: string };
  placeholderText: { color: string };
}

interface ThemeStylesMap {
  light: ThemeStyles;
  dark: ThemeStyles;
}

export default function CurrentListScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { todasAsListas, setTodasAsListas, listaAtivaId } =
    useContext(ListContext);
  const { theme } = useContext(ThemeContext);
  const [itemTexto, setItemTexto] = useState("");
  const [loading, setLoading] = useState(false);

  const listaAtiva = todasAsListas.find((l) => l.id === listaAtivaId);

  const themeStyles: ThemeStylesMap = {
    light: {
      container: { backgroundColor: Cores.cinzaFundo },
      section: { backgroundColor: Cores.branco, borderColor: Cores.cinzaInput },
      title: { color: Cores.pretoTexto },
      label: { color: Cores.pretoTexto },
      value: { color: Cores.cinzaTexto },
      button: { backgroundColor: Cores.roxoPrincipal },
      buttonText: { color: Cores.branco },
      input: {
        backgroundColor: Cores.branco,
        color: Cores.pretoTexto,
        borderColor: Cores.cinzaInput,
      },
      itemListaContainer: {
        backgroundColor: Cores.branco,
        borderColor: Cores.cinzaInput,
      },
      listaVaziaTexto: { color: Cores.cinzaTexto },
      checkbox: { borderColor: Cores.cinzaInput },
      checkboxComprado: {
        backgroundColor: Cores.roxoPrincipal,
        borderColor: Cores.roxoPrincipal,
      },
      textoBotaoAcao: { color: Cores.roxoPrincipal },
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
      input: {
        backgroundColor: Cores.brancoEscuro,
        color: Cores.pretoTextoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      itemListaContainer: {
        backgroundColor: Cores.brancoEscuro,
        borderColor: Cores.cinzaTextoEscuro,
      },
      listaVaziaTexto: { color: Cores.cinzaTextoEscuro },
      checkbox: { borderColor: Cores.cinzaTextoEscuro },
      checkboxComprado: {
        backgroundColor: Cores.roxoClaro,
        borderColor: Cores.roxoClaro,
      },
      textoBotaoAcao: { color: Cores.roxoClaro },
      placeholderText: { color: Cores.cinzaTextoEscuro },
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      ...themeStyles[theme as keyof ThemeStylesMap].container,
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
      ...themeStyles[theme as keyof ThemeStylesMap].title,
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
      paddingHorizontal: 20,
      borderRadius: 12,
      fontSize: 16,
      marginRight: 10,
      borderWidth: 1,
      ...themeStyles[theme as keyof ThemeStylesMap].input,
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
    checkboxArea: { flexDirection: "row", alignItems: "center", flex: 1 },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      ...themeStyles[theme as keyof ThemeStylesMap].checkbox,
    },
    checkboxComprado: {
      ...themeStyles[theme as keyof ThemeStylesMap].checkboxComprado,
    },
    checkboxCheck: { color: Cores.branco, fontWeight: "bold" },
    itemListaTexto: {
      fontSize: 18,
      flexShrink: 1,
      ...themeStyles[theme as keyof ThemeStylesMap].label,
    },
    itemTextoComprado: {
      textDecorationLine: "line-through",
      ...themeStyles[theme as keyof ThemeStylesMap].value,
    },
    acoesItem: { flexDirection: "row", alignItems: "center" },
    botaoAcao: { padding: 8 },
    textoBotaoAcao: {
      fontSize: 20,
      fontWeight: "bold",
      ...themeStyles[theme as keyof ThemeStylesMap].textoBotaoAcao,
    },
    quantidade: {
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 5,
      ...themeStyles[theme as keyof ThemeStylesMap].label,
    },
    listaVaziaTexto: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 50,
      ...themeStyles[theme as keyof ThemeStylesMap].listaVaziaTexto,
    },
  });

  useEffect(() => {
    const barcode = params.barcode;
    if (barcode && typeof barcode === "string" && barcode.length > 0) {
      buscarProduto(barcode);
      router.setParams({ barcode: "" });
    }
  }, [params.barcode]);

  const buscarProduto = async (barcode: string) => {
    if (!/^\d{8,13}$/.test(barcode)) {
      Alert.alert(
        "Erro",
        "Código de barras inválido. Deve conter 8 a 13 dígitos numéricos."
      );
      return;
    }

    setLoading(true);
    const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}?fields=product_name,product_name_en,product_name_pt,generic_name,brands,quantity,ingredients_text,categories,image_url,nutriments`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "ListfyApp/1.0 - Mobile App",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Produto não encontrado na base de dados.");
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();

      if (json.status === 1 && json.product) {
        const nomeDoProduto =
          json.product.product_name_pt ||
          json.product.product_name_en ||
          json.product.product_name ||
          (json.product.brands && json.product.generic_name
            ? `${json.product.brands} ${json.product.generic_name}`
            : json.product.brands || json.product.generic_name) ||
          "Produto escaneado";
        adicionarItem(nomeDoProduto, json.product);
      } else {
        Alert.alert(
          "Produto não encontrado",
          "Este código de barras não foi encontrado na base de dados do Open Food Facts."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message === "Produto não encontrado na base de dados."
          ? "Este código de barras não está registrado no Open Food Facts."
          : "Não foi possível buscar o produto. Verifique a conexão com a internet ou tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = (texto: string, detalhes?: any) => {
    if (texto.trim() === "" || !listaAtiva) return;
    const novoItem: Item = {
      id: Date.now().toString(),
      texto: texto,
      quantidade: 1,
      comprado: false,
      detalhes,
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

  const handleAdicionarManual = () => adicionarItem(itemTexto);

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
    if (item.detalhes) {
      router.push({
        pathname: "/details/[id]",
        params: { id: item.id, detalhes: JSON.stringify(item.detalhes) },
      });
    } else {
      Alert.alert(
        "Sem detalhes",
        "Este item foi adicionado manualmente e não possui detalhes."
      );
    }
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
        <Text
          style={[
            styles.itemListaTexto,
            item.comprado && styles.itemTextoComprado,
          ]}
        >
          {item.texto}
        </Text>
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
          <IconeLixeira />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={
          themeStyles[theme as keyof ThemeStylesMap].container.backgroundColor
        }
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={theme === "light" ? Cores.roxoPrincipal : Cores.roxoClaro}
          />
        </View>
      )}
      <View style={styles.headerContainer}>
        <Text style={styles.titulo}>{listaAtiva?.nome || "Minha Lista"}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar item manualmente..."
          placeholderTextColor={
            themeStyles[theme as keyof ThemeStylesMap].placeholderText.color
          }
          value={itemTexto}
          onChangeText={setItemTexto}
          onSubmitEditing={handleAdicionarManual}
        />
        <Pressable style={styles.botao} onPress={handleAdicionarManual}>
          <IconeAdicionar />
        </Pressable>
      </View>
      <FlatList
        data={listaAtiva?.itens || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() =>
          !loading && (
            <Text style={styles.listaVaziaTexto}>A sua lista está vazia.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}
