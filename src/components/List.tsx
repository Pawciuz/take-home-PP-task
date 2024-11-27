import { FC } from "react";
import { DeletedListItem, ListItem } from "../api/getListData";
import { DeleteButton, ExpandButton } from "./Buttons";
import { ChevronUpIcon, ChevronDownIcon } from "./icons";
import { useCardsStore } from "../utils/store/cardsStore";

type CardProps = {
  card: ListItem | DeletedListItem;
  deleteCard?: () => void;
};

export const Card: FC<CardProps> = ({ card, deleteCard }) => {
  const { cardStates, toggleCardExpand } = useCardsStore();

  const cardState = cardStates.find((state) => state.id === card.id);
  const isExpanded = cardState?.isExpanded || false;

  const hasDescription = (
    card: ListItem | DeletedListItem,
  ): card is ListItem => {
    return "description" in card && !!card.description;
  };

  return (
    <div
      className={`
      border border-black px-2 py-1.5 w-[400px]
      ${!hasDescription(card) ? "max-h-12 overflow-hidden " : ""}
    `}
    >
      <div className="flex justify-between mb-0.5">
        <h1 className="font-medium">{card.title}</h1>
        <div className="flex items-center gap-x-1">
          {hasDescription(card) && (
            <ExpandButton onClick={() => toggleCardExpand(card.id)}>
              {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </ExpandButton>
          )}
          {deleteCard && <DeleteButton onClick={() => deleteCard()} />}
        </div>
      </div>

      {hasDescription(card) && isExpanded && (
        <p className="text-sm mt-1">{card.description}</p>
      )}
    </div>
  );
};
