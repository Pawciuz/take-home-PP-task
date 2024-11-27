import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeletedListItem, ListItem } from "../../api/getListData";

type CardState = {
  id: number;
  isExpanded: boolean;
};

type CardsStore = {
  visibleCards: ListItem[];
  deletedCards: DeletedListItem[];
  cardStates: CardState[];
  showDeletedCards: boolean;
  toggleShowDeletedCards: () => void;
  deleteCard: (id: number) => void;
  setVisibleCards: (cards: ListItem[]) => void;
  toggleCardExpand: (id: number) => void;
  setCardStates: (cards: ListItem[]) => void;
};

export const useCardsStore = create(
  persist<CardsStore>(
    (set, get) => ({
      visibleCards: [],
      deletedCards: [],
      cardStates: [],
      showDeletedCards: false,

      toggleShowDeletedCards: () => {
        set((state) => ({ showDeletedCards: !state.showDeletedCards }));
      },

      setVisibleCards: (cards) => {
        set({ visibleCards: cards });
        const existingStateIds = get().cardStates.map((state) => state.id);
        const newCardStates = cards
          .filter((card) => !existingStateIds.includes(card.id))
          .map((card) => ({ id: card.id, isExpanded: false }));

        set((state) => ({
          cardStates: [...state.cardStates, ...newCardStates],
        }));
      },

      setCardStates: (cards) => {
        const newCardStates = cards.map((card) => ({
          id: card.id,
          isExpanded:
            get().cardStates.find((state) => state.id === card.id)
              ?.isExpanded || false,
        }));

        set({ cardStates: newCardStates });
      },

      toggleCardExpand: (id) => {
        set((state) => ({
          cardStates: state.cardStates.map((cardState) =>
            cardState.id === id
              ? { ...cardState, isExpanded: !cardState.isExpanded }
              : cardState,
          ),
        }));
      },

      deleteCard: (id) =>
        set((state) => {
          const cardToDelete = state.visibleCards.find(
            (card) => card.id === id,
          );

          if (!cardToDelete) return state;

          return {
            visibleCards: state.visibleCards.filter((card) => card.id !== id),
            deletedCards: [
              ...state.deletedCards,
              {
                id: cardToDelete.id,
                title: cardToDelete.title,
                isVisible: false,
              },
            ],
            cardStates: state.cardStates.filter(
              (cardState) => cardState.id !== id,
            ),
          };
        }),
    }),
    {
      name: "cards-storage",
    },
  ),
);
