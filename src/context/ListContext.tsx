import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Item {
  id: string;
  texto: string;
  quantidade: number;
  comprado: boolean;
  detalhes?: any;
}

export interface ListaDeCompras {
  id: string;
  nome: string;
  itens: Item[];
}

export const ListContext = createContext({
  todasAsListas: [] as ListaDeCompras[],
  setTodasAsListas: (listas: ListaDeCompras[]) => {},
  listaAtivaId: "",
  setListaAtivaId: (id: string) => {},
});

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [todasAsListas, setTodasAsListas] = useState<ListaDeCompras[]>([]);
  const [listaAtivaId, setListaAtivaId] = useState<string>("");

  useEffect(() => {
    const loadLists = async () => {
      const savedLists = await AsyncStorage.getItem("todasAsListas");
      if (savedLists) {
        setTodasAsListas(JSON.parse(savedLists));
      } else {
        const defaultList: ListaDeCompras = {
          id: Date.now().toString(),
          nome: "Minha Lista",
          itens: [],
        };
        setTodasAsListas([defaultList]);
        setListaAtivaId(defaultList.id);
      }
    };
    loadLists();
  }, []);

  useEffect(() => {
    if (todasAsListas.length > 0) {
      AsyncStorage.setItem("todasAsListas", JSON.stringify(todasAsListas));
      if (!listaAtivaId || !todasAsListas.find((l) => l.id === listaAtivaId)) {
        setListaAtivaId(todasAsListas[0].id);
      }
    }
  }, [todasAsListas, listaAtivaId]);

  return (
    <ListContext.Provider
      value={{ todasAsListas, setTodasAsListas, listaAtivaId, setListaAtivaId }}
    >
      {children}
    </ListContext.Provider>
  );
};
