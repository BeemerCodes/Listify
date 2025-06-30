import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Item {
  id: string;
  texto: string; // Nome do item
  quantidade: number;
  valorUnitario?: number; // Opcional inicialmente, para itens existentes
  valorTotalItem?: number; // Calculado: quantidade * valorUnitario, opcional para itens existentes
  comprado: boolean;
  // O campo 'detalhes' pode ser mantido se houver outros usos, ou removido se não.
  // Por ora, vou mantê-lo para não quebrar nada inesperado, mas não o usaremos para valor.
  detalhes?: any;
}

export interface ListaDeCompras {
  id: string;
  nome: string;
  itens: Item[];
  isArchived?: boolean; // Novo campo para arquivamento
}

// Definir o tipo para o valor do contexto para incluir a nova função
interface ListContextType {
  todasAsListas: ListaDeCompras[];
  setTodasAsListas: (listas: ListaDeCompras[]) => void;
  listaAtivaId: string;
  setListaAtivaId: (id: string) => void;
  archiveList: (listId: string) => void; // Nova função
}

export const ListContext = createContext<ListContextType>({
  todasAsListas: [],
  setTodasAsListas: () => {},
  listaAtivaId: "",
  setListaAtivaId: () => {},
  archiveList: () => {}, // Implementação padrão vazia
});

const TODAS_AS_LISTAS_KEY = "todasAsListas";
const LAST_ACTIVE_LIST_ID_KEY = "@ultimaListaAtivaId";

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [todasAsListas, setTodasAsListas] = useState<ListaDeCompras[]>([]);
  const [listaAtivaId, setListaAtivaId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const savedListsJson = await AsyncStorage.getItem(TODAS_AS_LISTAS_KEY);
        let currentLists: ListaDeCompras[] = [];

        if (savedListsJson) {
          currentLists = JSON.parse(savedListsJson);
          setTodasAsListas(currentLists);
        } else {
          const defaultList: ListaDeCompras = {
            id: Date.now().toString(),
            nome: "Minha Lista",
            itens: [],
          };
          currentLists = [defaultList];
          setTodasAsListas(currentLists);
          // Não definir listaAtivaId aqui ainda, faremos após carregar o ID salvo
        }

        if (currentLists.length > 0) {
          const savedActiveListId = await AsyncStorage.getItem(LAST_ACTIVE_LIST_ID_KEY);
          if (savedActiveListId && currentLists.find(l => l.id === savedActiveListId)) {
            setListaAtivaId(savedActiveListId);
          } else {
            // Se não houver ID salvo, ou o ID salvo não for válido, define o primeiro da lista como ativo
            setListaAtivaId(currentLists[0].id);
          }
        } else {
          // Se não houver listas (nem padrão, nem salvas), reseta o ID ativo.
          setListaAtivaId("");
        }

      } catch (error) {
        console.error("Falha ao carregar dados do AsyncStorage", error);
        // Em caso de erro, poderia tentar criar uma lista padrão como fallback
        if (todasAsListas.length === 0) {
            const defaultListOnError: ListaDeCompras = {
                id: `error-${Date.now().toString()}`,
                nome: "Minha Lista (Fallback)",
                itens: [],
              };
              setTodasAsListas([defaultListOnError]);
              setListaAtivaId(defaultListOnError.id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Executa apenas uma vez na montagem

  useEffect(() => {
    // Salvar todasAsListas e listaAtivaId sempre que mudarem (e não estiver carregando)
    if (!isLoading) {
      AsyncStorage.setItem(TODAS_AS_LISTAS_KEY, JSON.stringify(todasAsListas));
      if (listaAtivaId) { // Salva o ID da lista ativa apenas se houver um
        AsyncStorage.setItem(LAST_ACTIVE_LIST_ID_KEY, listaAtivaId);
      } else if (todasAsListas.length === 0) {
        // Se não houver listas, remove a chave do ID ativo para não carregar um ID inválido na próxima vez
        AsyncStorage.removeItem(LAST_ACTIVE_LIST_ID_KEY);
      }

      // Lógica para garantir que uma lista ativa válida esteja sempre selecionada se houver listas
      if (todasAsListas.length > 0) {
        if (!listaAtivaId || !todasAsListas.find((l) => l.id === listaAtivaId)) {
          setListaAtivaId(todasAsListas[0].id); // Define a primeira como ativa se nenhuma válida estiver
        }
      } else {
        // Se não há listas, garante que listaAtivaId seja string vazia
        if (listaAtivaId) setListaAtivaId("");
      }
    }
  }, [todasAsListas, listaAtivaId, isLoading]);

  const archiveList = (listId: string) => {
    setTodasAsListas(prevListas =>
      prevListas.map(lista =>
        lista.id === listId ? { ...lista, isArchived: true } : lista
      )
    );
    // A persistência ocorrerá automaticamente pelo useEffect que observa todasAsListas
  };

  return (
    <ListContext.Provider
      value={{
        todasAsListas,
        setTodasAsListas,
        listaAtivaId,
        setListaAtivaId,
        archiveList,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
