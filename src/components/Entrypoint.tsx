import { useEffect } from "react";
import { ListItem, useGetListData } from "../api/getListData";
import { Card } from "./List";
import { Spinner } from "./Spinner";
import { useCardsStore } from "../utils/store/cardsStore";
import { ToggleButton } from "./Buttons";

export const Entrypoint = () => {
  const {
    visibleCards,
    deletedCards,
    setVisibleCards,
    setCardStates,
    showDeletedCards,
    toggleShowDeletedCards,
  } = useCardsStore();

  const listQuery = useGetListData();

  useEffect(() => {
    if (listQuery.isLoading) {
      return;
    }
    const filteredCards =
      listQuery.data?.filter((item: ListItem) => item.isVisible) ?? [];
    setVisibleCards(filteredCards);
    setCardStates(filteredCards);
  }, [listQuery.data, listQuery.isLoading, setVisibleCards, setCardStates]);

  if (listQuery.isLoading) {
    return <Spinner />;
  }

  if (listQuery.isError) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error loading data</p>
      </div>
    );
  }

  return (
    <div className="flex gap-x-16">
      <div className="w-full max-w-xl">
        <div className="flex justify-between items-center">
          <h1 className="mb-1 font-medium text-lg">
            My Awesome List ({visibleCards.length})
          </h1>
          <button
            onClick={() => listQuery.refetch()}
            disabled={listQuery.isRefetching}
            className={`${listQuery.isRefetching && "cursor-not-allowed bg-gray-500"} text-white text-sm transition-colors bg-black rounded px-3 py-1 }`}
          >
            {listQuery.isRefetching ? "Loading.." : "Refresh"}
          </button>
        </div>
        <div className="flex flex-col gap-y-3">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={() => useCardsStore.getState().deleteCard(card.id)}
            />
          ))}
        </div>
      </div>
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between w-[400px]">
          <h1 className="mb-1 font-medium text-lg">
            Deleted Cards ({deletedCards.length})
          </h1>
          <ToggleButton
            isToggled={showDeletedCards}
            onToggle={toggleShowDeletedCards}
          >
            {showDeletedCards ? "Hide" : "Reveal"}
          </ToggleButton>
        </div>
        <div className="flex flex-col gap-y-3">
          {showDeletedCards &&
            deletedCards.map((card) => (
              <Card key={"deleted_" + card.id} card={card} />
            ))}
        </div>
      </div>
    </div>
  );
};
