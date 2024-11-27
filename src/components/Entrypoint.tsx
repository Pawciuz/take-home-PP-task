import { useEffect } from "react";
import { ListItem, useGetListData } from "../api/getListData";
import { Card } from "./Card";
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
    <div className="flex flex-col lg:flex-row gap-y-8 lg:gap-x-16 px-4 sm:px-8 lg:px-16">
      {/* Visible Cards Section */}
      <div className="w-full max-w-xl mx-auto lg:mx-0">
        <div className="flex justify-between items-center">
          <h1 className="mb-1 font-medium text-lg text-center lg:text-left">
            My Awesome List ({visibleCards.length})
          </h1>
          <button
            onClick={() => listQuery.refetch()}
            disabled={listQuery.isRefetching}
            className={`${
              listQuery.isRefetching && "cursor-not-allowed bg-gray-500"
            } text-white text-sm transition-colors bg-black rounded px-3 py-1`}
          >
            {listQuery.isRefetching ? "Loading.." : "Refresh"}
          </button>
        </div>
        <div className="flex flex-col gap-y-3 h-[400px] sm:h-[500px] lg:h-[700px] overflow-auto border border-gray-200 rounded-lg p-4">
          {visibleCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              deleteCard={() => useCardsStore.getState().deleteCard(card.id)}
            />
          ))}
        </div>
      </div>

      {/* Deleted Cards Section */}
      <div className="w-full max-w-xl mx-auto lg:mx-0">
        <div className="flex items-center justify-between">
          <h1 className="mb-1 font-medium text-lg text-center lg:text-left">
            Deleted Cards ({deletedCards.length})
          </h1>
          <ToggleButton
            isToggled={showDeletedCards}
            onToggle={toggleShowDeletedCards}
          >
            {showDeletedCards ? "Hide" : "Reveal"}
          </ToggleButton>
        </div>
        <div
          className={`transition-[max-height] duration-500 ease-in-out overflow-hidden border border-gray-200 rounded-lg  ${
            showDeletedCards
              ? "max-h-[400px] sm:max-h-[500px] lg:max-h-[700px] "
              : "max-h-0 "
          }`}
        >
          <div className="flex flex-col gap-y-3 h-[400px] sm:h-[500px] lg:h-[700px] overflow-auto p-2">
            {deletedCards.map((card) => (
              <div key={"deleted_" + card.id}>
                <Card card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
